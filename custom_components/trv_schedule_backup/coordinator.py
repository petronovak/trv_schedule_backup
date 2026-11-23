"""Coordinator, device discovery, diffing, safety snapshots, and Store."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
import logging
from typing import Any, TypedDict

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    CONF_AUTO_SAFETY_BACKUP,
    CONF_CLIMATE_ENTITIES,
    CONF_RESTORE_DELAY,
    DEFAULT_AUTO_SAFETY_BACKUP,
    DEFAULT_RESTORE_DELAY,
    DOMAIN,
    PARAM_ALL,
    PARAM_SETTINGS_GROUP,
    PARAM_SMART_TEMPERATURE_CONTROL,
    PARAM_SYSTEM_MODE,
    PARAM_WEEKLY_SCHEDULE,
    SAFETY_BACKUP_PROFILE,
    STORAGE_KEY,
    STORAGE_VERSION,
    TRVZB_SETTING_DOMAINS,
    TRVZB_SETTING_KEYS,
    VERIFY_SETTLE_DELAY,
    WEEKDAY_ORDER,
    WEEKLY_SCHEDULE_KEY,
)

_LOGGER = logging.getLogger(__name__)

LOCK_STATE_LOCKED = "locked"


class SettingSnapshot(TypedDict):
    """Snapshot for a single TRVZB configuration or climate mode entity."""

    entity_id: str
    domain: str
    value: Any


class DeviceSnapshot(TypedDict):
    """Snapshot for a single TRVZB device inside a backup profile."""

    device_id: str | None
    device_name: str
    schedules: dict[str, str]
    settings: dict[str, SettingSnapshot]


class ProfileRecord(TypedDict):
    """Named backup profile containing schedules and TRVZB settings."""

    name: str
    created_at: str
    updated_at: str
    schema_version: int
    devices: dict[str, DeviceSnapshot]


class VerificationMismatch(TypedDict):
    """Mismatch detected during post-restore readback verification."""

    entity_id: str
    param_key: str
    expected: Any
    actual: Any


class DiffChangeEntry(TypedDict):
    """Single difference between live HA state and saved profile target."""

    climate_entity_id: str
    device_name: str
    entity_id: str
    param_key: str
    domain: str
    current_value: Any
    target_value: Any


class RestoreResultSummary(TypedDict):
    """Summary of the most recent restore operation."""

    profile_name: str
    restored_count: int
    skipped_count: int
    skipped_unchanged_count: int
    failed_count: int
    safety_backup_profile: str | None
    restored_devices: list[str]
    restored_parameters: list[str]
    skipped_entities: list[str]
    verification_status: str
    verified_count: int
    mismatches: list[VerificationMismatch]
    finished_at: str


class StorePayload(TypedDict):
    """Root schema stored in .storage/trv_schedule_backup.json."""

    active_profile: str | None
    last_restored_at: str | None
    last_restore_result: RestoreResultSummary | None
    profiles: dict[str, ProfileRecord]


@dataclass(slots=True)
class DiscoveredTRV:
    """Resolved climate entity and all linked TRVZB schedule/setting entities."""

    climate_entity_id: str
    device_id: str | None
    device_name: str
    schedule_entities: list[str] = field(default_factory=list)
    setting_entities: dict[str, tuple[str, str]] = field(default_factory=dict)


def _weekday_sort_key(entity_id: str) -> tuple[int, str]:
    """Sort weekly_schedule entities chronologically from Monday to Sunday."""
    lowered = entity_id.lower()
    for idx, day in enumerate(WEEKDAY_ORDER):
        if lowered.endswith(f"_{day}") or f"_{day}_" in lowered:
            return (idx, entity_id)
    return (len(WEEKDAY_ORDER), entity_id)


def _match_setting_key(entity_id: str, translation_key: str | None) -> str | None:
    """Match a Home Assistant entity on a TRVZB device to a known Zigbee2MQTT key."""
    lowered_id = entity_id.lower()
    lowered_tkey = (translation_key or "").lower()
    for key in TRVZB_SETTING_KEYS:
        if key == PARAM_SYSTEM_MODE:
            continue
        if lowered_tkey == key or lowered_id.endswith(f"_{key}") or f"_{key}_" in lowered_id:
            return key
    return None


def _resolve_parameter_selection(
    parameters: list[str] | None,
) -> tuple[bool, set[str]]:
    """Expand group/key selection into (include_schedules, selected_setting_keys)."""
    if not parameters or PARAM_ALL in parameters:
        return True, set(TRVZB_SETTING_KEYS)

    include_schedules = False
    selected_settings: set[str] = set()

    for item in parameters:
        if item == PARAM_WEEKLY_SCHEDULE:
            include_schedules = True
        elif item == PARAM_SETTINGS_GROUP:
            selected_settings.update(TRVZB_SETTING_KEYS)
        elif item in TRVZB_SETTING_KEYS:
            selected_settings.add(item)

    return include_schedules, selected_settings


async def async_discover_schedule_entities(
    hass: HomeAssistant,
    climate_entity_ids: list[str],
) -> tuple[list[DiscoveredTRV], list[str]]:
    """Discover weekly_schedule, TRVZB setting entities, and system_mode by device_id."""
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)

    discovered: list[DiscoveredTRV] = []
    missing_climate: list[str] = []

    for climate_id in climate_entity_ids:
        climate_entry = ent_reg.async_get(climate_id)
        if climate_entry is None or climate_entry.device_id is None:
            missing_climate.append(climate_id)
            continue

        device = dev_reg.async_get(climate_entry.device_id)
        device_name = (
            (device.name_by_user or device.name)
            if device is not None
            else climate_id
        ) or climate_id

        device_entities = er.async_entries_for_device(
            ent_reg,
            climate_entry.device_id,
            include_disabled_entities=False,
        )

        schedule_entities: list[str] = []
        setting_entities: dict[str, tuple[str, str]] = {
            PARAM_SYSTEM_MODE: (climate_id, "climate"),
        }

        for entry in device_entities:
            if entry.domain == "text":
                entity_id_match = WEEKLY_SCHEDULE_KEY in entry.entity_id.lower()
                translation_match = (
                    entry.translation_key is not None
                    and WEEKLY_SCHEDULE_KEY in entry.translation_key.lower()
                )
                if entity_id_match or translation_match:
                    schedule_entities.append(entry.entity_id)
                continue

            if entry.domain in TRVZB_SETTING_DOMAINS:
                matched_key = _match_setting_key(
                    entry.entity_id, entry.translation_key
                )
                if matched_key is not None:
                    setting_entities[matched_key] = (entry.entity_id, entry.domain)

        schedule_entities.sort(key=_weekday_sort_key)
        discovered.append(
            DiscoveredTRV(
                climate_entity_id=climate_id,
                device_id=climate_entry.device_id,
                device_name=device_name,
                schedule_entities=schedule_entities,
                setting_entities=setting_entities,
            )
        )

    return discovered, missing_climate


def _empty_store() -> StorePayload:
    """Return a clean initial store payload."""
    return {
        "active_profile": None,
        "last_restored_at": None,
        "last_restore_result": None,
        "profiles": {},
    }


def _parse_state_value(domain: str, raw_state: str) -> Any:
    """Convert a Home Assistant entity state string into a typed snapshot value."""
    if domain == "number":
        try:
            return float(raw_state)
        except ValueError:
            return raw_state
    if domain == "switch":
        return raw_state.lower() in (STATE_ON, "true", "1")
    if domain == "lock":
        return raw_state.lower() in (LOCK_STATE_LOCKED, "lock", STATE_ON, "true")
    return raw_state


def _values_match(domain: str, expected: Any, actual_raw: str) -> bool:
    """Compare expected target value with live HA entity state string."""
    if actual_raw in (STATE_UNAVAILABLE, STATE_UNKNOWN, ""):
        return False
    if domain == "number":
        try:
            return abs(float(expected) - float(actual_raw)) <= 0.01
        except (TypeError, ValueError):
            return str(expected) == actual_raw
    if domain == "switch":
        exp_bool = (
            expected
            if isinstance(expected, bool)
            else str(expected).lower() in (STATE_ON, "true", "1")
        )
        act_bool = actual_raw.lower() in (STATE_ON, "true", "1")
        return exp_bool == act_bool
    if domain == "lock":
        exp_bool = (
            expected
            if isinstance(expected, bool)
            else str(expected).lower() in (LOCK_STATE_LOCKED, "lock", STATE_ON, "true")
        )
        act_bool = actual_raw.lower() in (LOCK_STATE_LOCKED, "lock", STATE_ON, "true")
        return exp_bool == act_bool
    return str(expected).strip() == actual_raw.strip()


class TRVScheduleCoordinator(DataUpdateCoordinator[StorePayload]):
    """Coordinates TRVZB discovery, persistent storage, diffing, and restores."""

    config_entry: ConfigEntry

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the coordinator and persistent Store."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            config_entry=entry,
        )
        self._store: Store[StorePayload] = Store(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY,
        )
        self._lock = asyncio.Lock()
        self.discovered_trvs: list[DiscoveredTRV] = []

    @property
    def climate_entities(self) -> list[str]:
        """Return configured climate entity IDs (options override initial data)."""
        return list(
            self.config_entry.options.get(
                CONF_CLIMATE_ENTITIES,
                self.config_entry.data.get(CONF_CLIMATE_ENTITIES, []),
            )
        )

    @property
    def restore_delay(self) -> float:
        """Return inter-packet Zigbee restore delay in seconds."""
        raw = self.config_entry.options.get(
            CONF_RESTORE_DELAY,
            self.config_entry.data.get(CONF_RESTORE_DELAY, DEFAULT_RESTORE_DELAY),
        )
        try:
            return max(0.05, float(raw))
        except (TypeError, ValueError):
            return DEFAULT_RESTORE_DELAY

    @property
    def auto_safety_backup(self) -> bool:
        """Return whether an automatic pre-restore safety snapshot is enabled."""
        return bool(
            self.config_entry.options.get(
                CONF_AUTO_SAFETY_BACKUP,
                self.config_entry.data.get(
                    CONF_AUTO_SAFETY_BACKUP, DEFAULT_AUTO_SAFETY_BACKUP
                ),
            )
        )

    @property
    def store_data(self) -> StorePayload:
        """Return current store payload safely."""
        if self.data is not None:
            return self.data
        return _empty_store()

    @property
    def profile_names(self) -> list[str]:
        """Return sorted list of saved profile names."""
        return sorted(self.store_data["profiles"].keys())

    @property
    def active_profile(self) -> str | None:
        """Return the active or last restored profile name if it still exists."""
        active = self.store_data.get("active_profile")
        if active and active in self.store_data["profiles"]:
            return active
        return None

    async def async_initialize(self) -> None:
        """Load persisted profiles from Store and resolve TRVZB entities."""
        stored = await self._store.async_load()
        payload: StorePayload = _empty_store()
        if isinstance(stored, dict):
            payload["active_profile"] = stored.get("active_profile")
            payload["last_restored_at"] = stored.get("last_restored_at")
            payload["last_restore_result"] = stored.get("last_restore_result")
            profiles = stored.get("profiles")
            if isinstance(profiles, dict):
                payload["profiles"] = profiles

        await self.async_refresh_discovered_entities()
        self.async_set_updated_data(payload)

    async def async_refresh_discovered_entities(self) -> list[DiscoveredTRV]:
        """Resolve all weekly_schedule and setting entities for configured TRVs."""
        discovered, missing = await async_discover_schedule_entities(
            self.hass,
            self.climate_entities,
        )
        if missing:
            _LOGGER.warning(
                "Some configured climate entities have no device_id in registry: %s",
                ", ".join(missing),
            )
        self.discovered_trvs = discovered
        return discovered

    def _filter_target_trvs(
        self,
        entities: list[str] | None,
    ) -> tuple[list[DiscoveredTRV], set[str] | None]:
        """Resolve which TRVs and/or specific entity IDs are targeted by a service call."""
        if not entities:
            return self.discovered_trvs, None

        requested = set(entities)
        selected_trvs: list[DiscoveredTRV] = []
        explicit_entity_ids: set[str] = set()

        for trv in self.discovered_trvs:
            trv_all_entities = set(trv.schedule_entities) | {
                eid for eid, _ in trv.setting_entities.values()
            }
            matched = trv_all_entities & requested
            if trv.climate_entity_id in requested:
                selected_trvs.append(trv)
                explicit_entity_ids.update(trv_all_entities)
            elif matched:
                selected_trvs.append(trv)
                explicit_entity_ids.update(matched)

        return selected_trvs, explicit_entity_ids

    async def _async_save_profile_locked(
        self,
        payload: StorePayload,
        profile_name: str,
        entities: list[str] | None = None,
        parameters: list[str] | None = None,
        allow_empty: bool = False,
    ) -> ProfileRecord | None:
        """Internal save routine executed while holding self._lock."""
        include_schedules, selected_settings = _resolve_parameter_selection(parameters)
        if not include_schedules and not selected_settings:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="no_matching_parameters",
            )

        await self.async_refresh_discovered_entities()
        target_trvs, explicit_entity_ids = self._filter_target_trvs(entities)
        if not target_trvs:
            if allow_empty:
                return None
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="no_matching_entities",
            )

        profiles = dict(payload["profiles"])
        now_iso = dt_util.utcnow().isoformat()

        existing = profiles.get(profile_name)
        devices_map: dict[str, DeviceSnapshot] = (
            dict(existing["devices"])
            if existing and entities and not allow_empty
            else {}
        )

        captured_count = 0

        for trv in target_trvs:
            prev_snapshot = devices_map.get(trv.climate_entity_id)
            schedules: dict[str, str] = (
                dict(prev_snapshot["schedules"]) if prev_snapshot else {}
            )
            settings: dict[str, SettingSnapshot] = (
                dict(prev_snapshot.get("settings", {})) if prev_snapshot else {}
            )

            if include_schedules:
                for text_entity_id in trv.schedule_entities:
                    if (
                        explicit_entity_ids is not None
                        and text_entity_id not in explicit_entity_ids
                    ):
                        continue

                    state = self.hass.states.get(text_entity_id)
                    if state is None or state.state in (
                        STATE_UNAVAILABLE,
                        STATE_UNKNOWN,
                        "",
                    ):
                        continue

                    schedules[text_entity_id] = state.state
                    captured_count += 1

            for param_key, (setting_entity_id, domain) in trv.setting_entities.items():
                if param_key not in selected_settings:
                    continue
                if (
                    explicit_entity_ids is not None
                    and setting_entity_id not in explicit_entity_ids
                ):
                    continue

                state = self.hass.states.get(setting_entity_id)
                if state is None or state.state in (
                    STATE_UNAVAILABLE,
                    STATE_UNKNOWN,
                    "",
                ):
                    continue

                settings[param_key] = {
                    "entity_id": setting_entity_id,
                    "domain": domain,
                    "value": _parse_state_value(domain, state.state),
                }
                captured_count += 1

            if schedules or settings:
                devices_map[trv.climate_entity_id] = {
                    "device_id": trv.device_id,
                    "device_name": trv.device_name,
                    "schedules": schedules,
                    "settings": settings,
                }

        if captured_count == 0:
            if allow_empty:
                return None
            raise HomeAssistantError(
                f"Could not read any available TRVZB entities for profile '{profile_name}'"
            )

        record: ProfileRecord = {
            "name": profile_name,
            "created_at": existing["created_at"] if existing and not allow_empty else now_iso,
            "updated_at": now_iso,
            "schema_version": STORAGE_VERSION,
            "devices": devices_map,
        }
        profiles[profile_name] = record
        payload["profiles"] = profiles
        return record

    async def async_save_profile(
        self,
        profile_name: str,
        entities: list[str] | None = None,
        parameters: list[str] | None = None,
    ) -> ProfileRecord:
        """Read current TRVZB schedules, settings, and system_mode and persist."""
        clean_name = profile_name.strip()
        if not clean_name:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="empty_profile_name",
            )

        async with self._lock:
            payload = dict(self.store_data)
            record = await self._async_save_profile_locked(
                payload,  # type: ignore[arg-type]
                clean_name,
                entities=entities,
                parameters=parameters,
                allow_empty=False,
            )
            assert record is not None
            await self._store.async_save(payload)  # type: ignore[arg-type]
            self.async_set_updated_data(payload)  # type: ignore[arg-type]
            return record

    def _build_write_queue(
        self,
        profile: ProfileRecord,
        entities: list[str] | None,
        parameters: list[str] | None,
    ) -> tuple[list[tuple[str, str, str, str, Any, str]], set[str]]:
        """Build ordered write queue (smart_temperature_control -> schedules -> settings -> system_mode)."""
        include_schedules, selected_settings = _resolve_parameter_selection(parameters)
        if not include_schedules and not selected_settings:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="no_matching_parameters",
            )

        target_filter = set(entities) if entities else None
        selected_climate_ids: set[str] = set(profile["devices"].keys())
        explicit_entity_ids: set[str] | None = None

        if target_filter is not None:
            selected_climate_ids = set()
            explicit_entity_ids = set()
            for climate_id, snapshot in profile["devices"].items():
                all_dev_entities = set(snapshot["schedules"].keys()) | {
                    s["entity_id"]
                    for s in snapshot.get("settings", {}).values()
                    if isinstance(s, dict) and "entity_id" in s
                }
                if climate_id in target_filter:
                    selected_climate_ids.add(climate_id)
                    explicit_entity_ids.update(all_dev_entities)
                else:
                    matched = all_dev_entities & target_filter
                    if matched:
                        selected_climate_ids.add(climate_id)
                        explicit_entity_ids.update(matched)

        write_queue: list[tuple[str, str, str, str, Any, str]] = []
        system_mode_queue: list[tuple[str, str, str, str, Any, str]] = []

        for climate_id, snapshot in profile["devices"].items():
            if climate_id not in selected_climate_ids:
                continue

            device_name = snapshot.get("device_name", climate_id)
            raw_settings = snapshot.get("settings", {})

            if PARAM_SMART_TEMPERATURE_CONTROL in selected_settings:
                stc_entry = raw_settings.get(PARAM_SMART_TEMPERATURE_CONTROL)
                if isinstance(stc_entry, dict) and stc_entry.get("entity_id"):
                    stc_eid = str(stc_entry["entity_id"])
                    if explicit_entity_ids is None or stc_eid in explicit_entity_ids:
                        write_queue.append(
                            (
                                climate_id,
                                PARAM_SMART_TEMPERATURE_CONTROL,
                                stc_eid,
                                str(stc_entry.get("domain", "switch")),
                                stc_entry.get("value"),
                                device_name,
                            )
                        )

            if include_schedules:
                ordered_schedules = sorted(
                    snapshot["schedules"].items(),
                    key=lambda item: _weekday_sort_key(item[0]),
                )
                for text_entity_id, schedule_value in ordered_schedules:
                    if (
                        explicit_entity_ids is not None
                        and text_entity_id not in explicit_entity_ids
                    ):
                        continue
                    write_queue.append(
                        (
                            climate_id,
                            PARAM_WEEKLY_SCHEDULE,
                            text_entity_id,
                            "text",
                            schedule_value,
                            device_name,
                        )
                    )

            for param_key in TRVZB_SETTING_KEYS:
                if param_key in (PARAM_SMART_TEMPERATURE_CONTROL, PARAM_SYSTEM_MODE):
                    continue
                if param_key not in selected_settings:
                    continue
                setting_entry = raw_settings.get(param_key)
                if not isinstance(setting_entry, dict):
                    continue
                setting_entity_id = setting_entry.get("entity_id")
                setting_domain = setting_entry.get("domain")
                if not setting_entity_id or not setting_domain:
                    continue
                if (
                    explicit_entity_ids is not None
                    and setting_entity_id not in explicit_entity_ids
                ):
                    continue
                write_queue.append(
                    (
                        climate_id,
                        param_key,
                        str(setting_entity_id),
                        str(setting_domain),
                        setting_entry.get("value"),
                        device_name,
                    )
                )

            if PARAM_SYSTEM_MODE in selected_settings:
                mode_entry = raw_settings.get(PARAM_SYSTEM_MODE)
                if isinstance(mode_entry, dict) and mode_entry.get("entity_id"):
                    mode_eid = str(mode_entry["entity_id"])
                    if explicit_entity_ids is None or mode_eid in explicit_entity_ids:
                        system_mode_queue.append(
                            (
                                climate_id,
                                PARAM_SYSTEM_MODE,
                                mode_eid,
                                str(mode_entry.get("domain", "climate")),
                                mode_entry.get("value"),
                                device_name,
                            )
                        )

        write_queue.extend(system_mode_queue)
        return write_queue, selected_climate_ids

    async def async_diff_profile(
        self,
        profile_name: str,
        entities: list[str] | None = None,
        parameters: list[str] | None = None,
    ) -> dict[str, Any]:
        """Compare a stored profile against live Home Assistant states."""
        clean_name = profile_name.strip()
        profile = self.store_data["profiles"].get(clean_name)
        if profile is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="profile_not_found",
                translation_placeholders={"profile_name": clean_name},
            )

        write_queue, _ = self._build_write_queue(profile, entities, parameters)
        if not write_queue:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="no_matching_entities",
            )

        changes: list[DiffChangeEntry] = []
        unchanged_count = 0
        unavailable_count = 0

        for climate_id, param_key, entity_id, domain, target_val, device_name in write_queue:
            state = self.hass.states.get(entity_id)
            if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
                unavailable_count += 1
                continue

            if _values_match(domain, target_val, state.state):
                unchanged_count += 1
            else:
                changes.append(
                    {
                        "climate_entity_id": climate_id,
                        "device_name": device_name,
                        "entity_id": entity_id,
                        "param_key": param_key,
                        "domain": domain,
                        "current_value": _parse_state_value(domain, state.state),
                        "target_value": target_val,
                    }
                )

        return {
            "profile_name": clean_name,
            "total_checked": len(write_queue),
            "diff_count": len(changes),
            "unchanged_count": unchanged_count,
            "unavailable_count": unavailable_count,
            "changes": changes,
        }

    async def _async_dispatch_entity_write(
        self,
        entity_id: str,
        domain: str,
        value: Any,
    ) -> None:
        """Call the appropriate Home Assistant service for the target entity domain."""
        if domain == "text":
            await self.hass.services.async_call(
                "text",
                "set_value",
                {"entity_id": entity_id, "value": str(value)},
                blocking=True,
            )
            return

        if domain == "number":
            await self.hass.services.async_call(
                "number",
                "set_value",
                {"entity_id": entity_id, "value": float(value)},
                blocking=True,
            )
            return

        if domain == "switch":
            enabled = (
                value
                if isinstance(value, bool)
                else str(value).lower() in (STATE_ON, "true", "1", "lock")
            )
            await self.hass.services.async_call(
                "switch",
                "turn_on" if enabled else "turn_off",
                {"entity_id": entity_id},
                blocking=True,
            )
            return

        if domain == "lock":
            locked = (
                value
                if isinstance(value, bool)
                else str(value).lower() in (LOCK_STATE_LOCKED, "lock", STATE_ON, "true")
            )
            await self.hass.services.async_call(
                "lock",
                "lock" if locked else "unlock",
                {"entity_id": entity_id},
                blocking=True,
            )
            return

        if domain == "select":
            await self.hass.services.async_call(
                "select",
                "select_option",
                {"entity_id": entity_id, "option": str(value)},
                blocking=True,
            )
            return

        if domain == "climate":
            await self.hass.services.async_call(
                "climate",
                "set_hvac_mode",
                {"entity_id": entity_id, "hvac_mode": str(value)},
                blocking=True,
            )
            return

        raise HomeAssistantError(f"Unsupported entity domain '{domain}' for {entity_id}")

    async def async_restore_profile(
        self,
        profile_name: str,
        entities: list[str] | None = None,
        parameters: list[str] | None = None,
        verify: bool = False,
        delta_only: bool = False,
        safety_backup: bool | None = None,
    ) -> RestoreResultSummary:
        """Restore TRVZB devices and parameters sequentially with optional safety snapshot, delta filtering, and readback verification."""
        clean_name = profile_name.strip()

        async with self._lock:
            payload = dict(self.store_data)
            profiles = dict(payload["profiles"])
            profile = profiles.get(clean_name)
            if profile is None:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="profile_not_found",
                    translation_placeholders={"profile_name": clean_name},
                )

            await self.async_refresh_discovered_entities()
            write_queue, selected_climate_ids = self._build_write_queue(
                profile, entities, parameters
            )
            if not write_queue:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="no_matching_entities",
                )

            # Optional automatic safety snapshot before overwriting live devices
            use_safety = (
                self.auto_safety_backup if safety_backup is None else safety_backup
            )
            created_safety_profile: str | None = None
            if use_safety and clean_name != SAFETY_BACKUP_PROFILE:
                safety_record = await self._async_save_profile_locked(
                    payload,  # type: ignore[arg-type]
                    SAFETY_BACKUP_PROFILE,
                    entities=list(selected_climate_ids),
                    parameters=None,
                    allow_empty=True,
                )
                if safety_record is not None:
                    created_safety_profile = SAFETY_BACKUP_PROFILE

            restored_count = 0
            skipped_unchanged_count = 0
            failed_count = 0
            skipped_entities: list[str] = []
            restored_devices_set: set[str] = set()
            restored_params_set: set[str] = set()
            dispatched_items: list[tuple[str, str, str, Any]] = []
            delay = self.restore_delay

            for idx, (climate_id, param_key, entity_id, domain, value, _) in enumerate(
                write_queue
            ):
                state = self.hass.states.get(entity_id)
                if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
                    _LOGGER.warning(
                        "Skipping unavailable entity %s during restore of profile '%s'",
                        entity_id,
                        clean_name,
                    )
                    skipped_entities.append(entity_id)
                    continue

                if delta_only and _values_match(domain, value, state.state):
                    skipped_unchanged_count += 1
                    continue

                try:
                    await self._async_dispatch_entity_write(entity_id, domain, value)
                    restored_count += 1
                    restored_devices_set.add(climate_id)
                    restored_params_set.add(param_key)
                    dispatched_items.append((entity_id, domain, param_key, value))
                except HomeAssistantError as err:
                    failed_count += 1
                    skipped_entities.append(entity_id)
                    _LOGGER.error(
                        "Failed to restore %s (%s) for profile '%s': %s",
                        entity_id,
                        param_key,
                        clean_name,
                        err,
                    )

                if idx < len(write_queue) - 1:
                    await asyncio.sleep(delay)

            verification_status = "not_run"
            verified_count = 0
            mismatches: list[VerificationMismatch] = []

            if verify and dispatched_items:
                await asyncio.sleep(VERIFY_SETTLE_DELAY)
                for entity_id, domain, param_key, expected in dispatched_items:
                    current_state = self.hass.states.get(entity_id)
                    actual_raw = current_state.state if current_state else None
                    if actual_raw is not None and _values_match(
                        domain, expected, actual_raw
                    ):
                        verified_count += 1
                    else:
                        mismatches.append(
                            {
                                "entity_id": entity_id,
                                "param_key": param_key,
                                "expected": expected,
                                "actual": actual_raw,
                            }
                        )
                        _LOGGER.warning(
                            "Verification mismatch on %s (%s): expected '%s', got '%s'",
                            entity_id,
                            param_key,
                            expected,
                            actual_raw,
                        )
                verification_status = (
                    "mismatches_found" if mismatches else "passed"
                )

            finished_at = dt_util.utcnow().isoformat()
            summary: RestoreResultSummary = {
                "profile_name": clean_name,
                "restored_count": restored_count,
                "skipped_count": len(skipped_entities) - failed_count,
                "skipped_unchanged_count": skipped_unchanged_count,
                "failed_count": failed_count,
                "safety_backup_profile": created_safety_profile,
                "restored_devices": sorted(restored_devices_set),
                "restored_parameters": sorted(restored_params_set),
                "skipped_entities": skipped_entities,
                "verification_status": verification_status,
                "verified_count": verified_count,
                "mismatches": mismatches,
                "finished_at": finished_at,
            }

            payload["active_profile"] = clean_name
            payload["last_restored_at"] = finished_at
            payload["last_restore_result"] = summary

            await self._store.async_save(payload)  # type: ignore[arg-type]
            self.async_set_updated_data(payload)  # type: ignore[arg-type]
            return summary

    async def async_delete_profile(self, profile_name: str) -> None:
        """Delete a stored backup profile by name."""
        clean_name = profile_name.strip()
        async with self._lock:
            payload = dict(self.store_data)
            profiles = dict(payload["profiles"])
            if clean_name not in profiles:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="profile_not_found",
                    translation_placeholders={"profile_name": clean_name},
                )

            del profiles[clean_name]
            payload["profiles"] = profiles
            if payload.get("active_profile") == clean_name:
                payload["active_profile"] = None

            await self._store.async_save(payload)  # type: ignore[arg-type]
            self.async_set_updated_data(payload)  # type: ignore[arg-type]

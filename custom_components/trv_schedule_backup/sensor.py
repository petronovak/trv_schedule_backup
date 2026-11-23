"""Sensor platform exposing saved TRVZB backup profiles and diagnostics."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import TRVScheduleConfigEntry
from .const import DOMAIN
from .coordinator import TRVScheduleCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: TRVScheduleConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the TRV schedule profiles sensor entity."""
    async_add_entities([TRVScheduleProfilesSensor(entry.runtime_data, entry)])


class TRVScheduleProfilesSensor(
    CoordinatorEntity[TRVScheduleCoordinator], SensorEntity
):
    """Sensor reporting saved profile count and full profile metadata in attributes."""

    _attr_has_entity_name = True
    _attr_translation_key = "saved_profiles"
    _attr_icon = "mdi:calendar-clock"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(
        self,
        coordinator: TRVScheduleCoordinator,
        entry: TRVScheduleConfigEntry,
    ) -> None:
        """Initialize the sensor entity."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{entry.entry_id}_saved_profiles"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="TRV Schedule Backup",
            manufacturer="Sonoff / Zigbee2MQTT",
            model="TRVZB Backup Manager",
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def native_value(self) -> int:
        """Return the number of saved backup profiles."""
        return len(self.coordinator.profile_names)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Expose profile list, timestamps, device/parameter coverage, and verification results."""
        store = self.coordinator.store_data
        profiles = store["profiles"]

        profile_details: dict[str, dict[str, Any]] = {}
        for name in sorted(profiles.keys()):
            record = profiles[name]
            schedule_count = sum(
                len(dev["schedules"]) for dev in record["devices"].values()
            )
            setting_keys: set[str] = set()
            setting_count = 0
            for dev in record["devices"].values():
                dev_settings = dev.get("settings", {})
                setting_count += len(dev_settings)
                setting_keys.update(dev_settings.keys())

            profile_details[name] = {
                "created_at": record["created_at"],
                "updated_at": record["updated_at"],
                "schema_version": record["schema_version"],
                "device_count": len(record["devices"]),
                "schedule_count": schedule_count,
                "setting_count": setting_count,
                "parameter_keys": (
                    (["weekly_schedule"] if schedule_count > 0 else [])
                    + sorted(setting_keys)
                ),
                "devices": list(record["devices"].keys()),
            }

        managed_schedules = {
            trv.climate_entity_id: trv.schedule_entities
            for trv in self.coordinator.discovered_trvs
        }
        managed_settings = {
            trv.climate_entity_id: {
                key: eid for key, (eid, _) in trv.setting_entities.items()
            }
            for trv in self.coordinator.discovered_trvs
        }

        return {
            "profiles": self.coordinator.profile_names,
            "profile_details": profile_details,
            "active_profile": self.coordinator.active_profile,
            "last_restored_at": store.get("last_restored_at"),
            "last_restore_result": store.get("last_restore_result"),
            "managed_climate_entities": self.coordinator.climate_entities,
            "managed_schedule_entities": managed_schedules,
            "managed_setting_entities": managed_settings,
        }

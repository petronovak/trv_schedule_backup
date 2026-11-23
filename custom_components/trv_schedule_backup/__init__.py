"""The Sonoff TRVZB Schedule Backup integration."""

from __future__ import annotations

from typing import TypeAlias

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv

from .const import (
    ALL_RESTORE_PARAMETER_OPTIONS,
    ATTR_DELTA_ONLY,
    ATTR_ENTITIES,
    ATTR_PARAMETERS,
    ATTR_PROFILE_NAME,
    ATTR_SAFETY_BACKUP,
    ATTR_VERIFY,
    DEFAULT_DELTA_ONLY,
    DEFAULT_VERIFY,
    DOMAIN,
    PLATFORMS,
    SERVICE_DELETE_PROFILE,
    SERVICE_DIFF_PROFILE,
    SERVICE_RESTORE_PROFILE,
    SERVICE_SAVE_PROFILE,
)
from .coordinator import TRVScheduleCoordinator

TRVScheduleConfigEntry: TypeAlias = ConfigEntry[TRVScheduleCoordinator]

SERVICE_SAVE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_PROFILE_NAME): cv.string,
        vol.Optional(ATTR_ENTITIES): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional(ATTR_PARAMETERS): vol.All(
            cv.ensure_list,
            [vol.In(ALL_RESTORE_PARAMETER_OPTIONS)],
        ),
    }
)

SERVICE_RESTORE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_PROFILE_NAME): cv.string,
        vol.Optional(ATTR_ENTITIES): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional(ATTR_PARAMETERS): vol.All(
            cv.ensure_list,
            [vol.In(ALL_RESTORE_PARAMETER_OPTIONS)],
        ),
        vol.Optional(ATTR_VERIFY, default=DEFAULT_VERIFY): cv.boolean,
        vol.Optional(ATTR_DELTA_ONLY, default=DEFAULT_DELTA_ONLY): cv.boolean,
        vol.Optional(ATTR_SAFETY_BACKUP): cv.boolean,
    }
)

SERVICE_DIFF_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_PROFILE_NAME): cv.string,
        vol.Optional(ATTR_ENTITIES): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional(ATTR_PARAMETERS): vol.All(
            cv.ensure_list,
            [vol.In(ALL_RESTORE_PARAMETER_OPTIONS)],
        ),
    }
)

SERVICE_DELETE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_PROFILE_NAME): cv.string,
    }
)


def _get_active_coordinator(hass: HomeAssistant) -> TRVScheduleCoordinator:
    """Return the active TRVScheduleCoordinator from loaded config entries."""
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise HomeAssistantError(
            "No loaded TRV Schedule Backup integration entry found"
        )
    return entries[0].runtime_data


async def async_setup_entry(
    hass: HomeAssistant,
    entry: TRVScheduleConfigEntry,
) -> bool:
    """Set up Sonoff TRVZB Schedule Backup from a config entry."""
    coordinator = TRVScheduleCoordinator(hass, entry)
    await coordinator.async_initialize()
    entry.runtime_data = coordinator

    entry.async_on_unload(entry.add_update_listener(async_reload_entry))

    _async_register_services(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


def _async_register_services(hass: HomeAssistant) -> None:
    """Register domain services once across reloads."""
    if not hass.services.has_service(DOMAIN, SERVICE_SAVE_PROFILE):

        async def handle_save_profile(call: ServiceCall) -> None:
            coordinator = _get_active_coordinator(hass)
            await coordinator.async_save_profile(
                profile_name=call.data[ATTR_PROFILE_NAME],
                entities=call.data.get(ATTR_ENTITIES),
                parameters=call.data.get(ATTR_PARAMETERS),
            )

        hass.services.async_register(
            DOMAIN,
            SERVICE_SAVE_PROFILE,
            handle_save_profile,
            schema=SERVICE_SAVE_SCHEMA,
        )

    if not hass.services.has_service(DOMAIN, SERVICE_RESTORE_PROFILE):

        async def handle_restore_profile(call: ServiceCall) -> None:
            coordinator = _get_active_coordinator(hass)
            await coordinator.async_restore_profile(
                profile_name=call.data[ATTR_PROFILE_NAME],
                entities=call.data.get(ATTR_ENTITIES),
                parameters=call.data.get(ATTR_PARAMETERS),
                verify=call.data.get(ATTR_VERIFY, DEFAULT_VERIFY),
                delta_only=call.data.get(ATTR_DELTA_ONLY, DEFAULT_DELTA_ONLY),
                safety_backup=call.data.get(ATTR_SAFETY_BACKUP),
            )

        hass.services.async_register(
            DOMAIN,
            SERVICE_RESTORE_PROFILE,
            handle_restore_profile,
            schema=SERVICE_RESTORE_SCHEMA,
        )

    if not hass.services.has_service(DOMAIN, SERVICE_DIFF_PROFILE):

        async def handle_diff_profile(call: ServiceCall) -> ServiceResponse:
            coordinator = _get_active_coordinator(hass)
            return await coordinator.async_diff_profile(
                profile_name=call.data[ATTR_PROFILE_NAME],
                entities=call.data.get(ATTR_ENTITIES),
                parameters=call.data.get(ATTR_PARAMETERS),
            )

        hass.services.async_register(
            DOMAIN,
            SERVICE_DIFF_PROFILE,
            handle_diff_profile,
            schema=SERVICE_DIFF_SCHEMA,
            supports_response=SupportsResponse.ONLY,
        )

    if not hass.services.has_service(DOMAIN, SERVICE_DELETE_PROFILE):

        async def handle_delete_profile(call: ServiceCall) -> None:
            coordinator = _get_active_coordinator(hass)
            await coordinator.async_delete_profile(
                profile_name=call.data[ATTR_PROFILE_NAME],
            )

        hass.services.async_register(
            DOMAIN,
            SERVICE_DELETE_PROFILE,
            handle_delete_profile,
            schema=SERVICE_DELETE_SCHEMA,
        )


async def async_unload_entry(
    hass: HomeAssistant,
    entry: TRVScheduleConfigEntry,
) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        remaining = [
            loaded
            for loaded in hass.config_entries.async_loaded_entries(DOMAIN)
            if loaded.entry_id != entry.entry_id
        ]
        if not remaining:
            hass.services.async_remove(DOMAIN, SERVICE_SAVE_PROFILE)
            hass.services.async_remove(DOMAIN, SERVICE_RESTORE_PROFILE)
            hass.services.async_remove(DOMAIN, SERVICE_DIFF_PROFILE)
            hass.services.async_remove(DOMAIN, SERVICE_DELETE_PROFILE)
    return unload_ok


async def async_reload_entry(
    hass: HomeAssistant,
    entry: TRVScheduleConfigEntry,
) -> None:
    """Reload integration when options are updated via the UI."""
    await hass.config_entries.async_reload(entry.entry_id)

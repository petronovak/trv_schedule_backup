"""Select platform for switching and restoring TRVZB schedule profiles."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
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
    """Set up the TRV schedule profile select entity."""
    async_add_entities([TRVScheduleProfileSelect(entry.runtime_data, entry)])


class TRVScheduleProfileSelect(
    CoordinatorEntity[TRVScheduleCoordinator], SelectEntity
):
    """Select entity representing the active/last restored TRVZB backup profile."""

    _attr_has_entity_name = True
    _attr_translation_key = "active_profile"
    _attr_icon = "mdi:thermostat-box"

    def __init__(
        self,
        coordinator: TRVScheduleCoordinator,
        entry: TRVScheduleConfigEntry,
    ) -> None:
        """Initialize the select entity."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{entry.entry_id}_active_profile"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="TRV Schedule Backup",
            manufacturer="Sonoff / Zigbee2MQTT",
            model="TRVZB Backup Manager",
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def options(self) -> list[str]:
        """Return list of all stored backup profile names."""
        return self.coordinator.profile_names

    @property
    def current_option(self) -> str | None:
        """Return currently active/last restored profile name."""
        return self.coordinator.active_profile

    async def async_select_option(self, option: str) -> None:
        """Restore all devices and parameters from the selected backup profile."""
        await self.coordinator.async_restore_profile(option)

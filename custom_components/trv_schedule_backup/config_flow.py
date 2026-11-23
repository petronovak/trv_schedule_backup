"""Config flow and Options flow for Sonoff TRVZB Schedule Backup."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import selector

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigFlowResult

from .const import (
    CONF_AUTO_SAFETY_BACKUP,
    CONF_CLIMATE_ENTITIES,
    CONF_RESTORE_DELAY,
    CONF_SHOW_SIDEBAR_PANEL,
    DEFAULT_AUTO_SAFETY_BACKUP,
    DEFAULT_RESTORE_DELAY,
    DEFAULT_SHOW_SIDEBAR_PANEL,
    DOMAIN,
)
from .coordinator import async_discover_schedule_entities


def _build_user_schema(
    default_entities: list[str] | None = None,
    default_delay: float = DEFAULT_RESTORE_DELAY,
    default_safety: bool = DEFAULT_AUTO_SAFETY_BACKUP,
    default_show_panel: bool = DEFAULT_SHOW_SIDEBAR_PANEL,
) -> vol.Schema:
    """Build schema with multi-select climate EntitySelector, delay, safety backup, and sidebar toggle."""
    return vol.Schema(
        {
            vol.Required(
                CONF_CLIMATE_ENTITIES,
                default=default_entities or [],
            ): selector.EntitySelector(
                selector.EntitySelectorConfig(
                    domain="climate",
                    multiple=True,
                )
            ),
            vol.Optional(
                CONF_RESTORE_DELAY,
                default=default_delay,
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0.05,
                    max=2.0,
                    step=0.05,
                    unit_of_measurement="s",
                    mode=selector.NumberSelectorMode.BOX,
                )
            ),
            vol.Optional(
                CONF_AUTO_SAFETY_BACKUP,
                default=default_safety,
            ): selector.BooleanSelector(),
            vol.Optional(
                CONF_SHOW_SIDEBAR_PANEL,
                default=default_show_panel,
            ): selector.BooleanSelector(),
        }
    )


class TRVScheduleBackupConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Sonoff TRVZB Schedule Backup."""

    VERSION = 1

    async def async_step_user(
        self,
        user_input: dict[str, Any] | None = None,
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            climate_entities: list[str] = user_input.get(CONF_CLIMATE_ENTITIES, [])
            if not climate_entities:
                errors["base"] = "no_climate_entities"
            else:
                discovered, _ = await async_discover_schedule_entities(
                    self.hass,
                    climate_entities,
                )
                total_entities = sum(
                    len(trv.schedule_entities) + len(trv.setting_entities)
                    for trv in discovered
                )
                if total_entities == 0:
                    errors["base"] = "no_schedule_entities"
                else:
                    await self.async_set_unique_id(DOMAIN)
                    self._abort_if_unique_id_configured()
                    return self.async_create_entry(
                        title="Sonoff TRVZB Schedule Backup",
                        data=user_input,
                    )

        return self.async_show_form(
            step_id="user",
            data_schema=_build_user_schema(),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Return the options flow handler."""
        return TRVScheduleBackupOptionsFlow()


class TRVScheduleBackupOptionsFlow(OptionsFlow):
    """Handle options flow to add/remove thermostats, delay, or safety backup."""

    async def async_step_init(
        self,
        user_input: dict[str, Any] | None = None,
    ) -> ConfigFlowResult:
        """Manage the options."""
        errors: dict[str, str] = {}

        current_entities = list(
            self.config_entry.options.get(
                CONF_CLIMATE_ENTITIES,
                self.config_entry.data.get(CONF_CLIMATE_ENTITIES, []),
            )
        )
        current_delay = float(
            self.config_entry.options.get(
                CONF_RESTORE_DELAY,
                self.config_entry.data.get(
                    CONF_RESTORE_DELAY, DEFAULT_RESTORE_DELAY
                ),
            )
        )
        current_safety = bool(
            self.config_entry.options.get(
                CONF_AUTO_SAFETY_BACKUP,
                self.config_entry.data.get(
                    CONF_AUTO_SAFETY_BACKUP, DEFAULT_AUTO_SAFETY_BACKUP
                ),
            )
        )
        current_show_panel = bool(
            self.config_entry.options.get(
                CONF_SHOW_SIDEBAR_PANEL,
                self.config_entry.data.get(
                    CONF_SHOW_SIDEBAR_PANEL, DEFAULT_SHOW_SIDEBAR_PANEL
                ),
            )
        )

        if user_input is not None:
            climate_entities: list[str] = user_input.get(CONF_CLIMATE_ENTITIES, [])
            if not climate_entities:
                errors["base"] = "no_climate_entities"
            else:
                discovered, _ = await async_discover_schedule_entities(
                    self.hass,
                    climate_entities,
                )
                total_entities = sum(
                    len(trv.schedule_entities) + len(trv.setting_entities)
                    for trv in discovered
                )
                if total_entities == 0:
                    errors["base"] = "no_schedule_entities"
                else:
                    return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=_build_user_schema(
                current_entities,
                current_delay,
                current_safety,
                current_show_panel,
            ),
            errors=errors,
        )

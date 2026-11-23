"""Constants for the Sonoff TRVZB Schedule Backup integration."""

from __future__ import annotations

from homeassistant.const import Platform

DOMAIN = "trv_schedule_backup"
PLATFORMS: list[Platform] = [Platform.SELECT, Platform.SENSOR]

PANEL_URL_PATH = "/trv_schedule_backup_panel"
PANEL_MODULE_URL = "/trv_schedule_backup_panel/trvzb-panel.js"
PANEL_WEBCOMPONENT_NAME = "trvzb-backup-panel"
PANEL_SIDEBAR_TITLE = "TRVZB Backup"
PANEL_SIDEBAR_ICON = "mdi:thermostat-cog"
PANEL_VERSION = "1.4.0"

# Store(hass, STORAGE_VERSION, STORAGE_KEY) saves directly to .storage/trv_schedule_backup.json
STORAGE_KEY = "trv_schedule_backup.json"
STORAGE_VERSION = 1

CONF_CLIMATE_ENTITIES = "climate_entities"
CONF_RESTORE_DELAY = "restore_delay"
CONF_AUTO_SAFETY_BACKUP = "auto_safety_backup"

DEFAULT_RESTORE_DELAY = 0.25
DEFAULT_AUTO_SAFETY_BACKUP = True
VERIFY_SETTLE_DELAY = 1.5

SAFETY_BACKUP_PROFILE = "_last_before_restore"

WEEKLY_SCHEDULE_KEY = "weekly_schedule"
WEEKDAY_ORDER: tuple[str, ...] = (
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
)

SERVICE_SAVE_PROFILE = "save_profile"
SERVICE_RESTORE_PROFILE = "restore_profile"
SERVICE_DELETE_PROFILE = "delete_profile"
SERVICE_DIFF_PROFILE = "diff_profile"

ATTR_PROFILE_NAME = "profile_name"
ATTR_ENTITIES = "entities"
ATTR_PARAMETERS = "parameters"
ATTR_VERIFY = "verify"
ATTR_DELTA_ONLY = "delta_only"
ATTR_SAFETY_BACKUP = "safety_backup"

DEFAULT_VERIFY = False
DEFAULT_DELTA_ONLY = False

PARAM_ALL = "all"
PARAM_WEEKLY_SCHEDULE = "weekly_schedule"
PARAM_SETTINGS_GROUP = "settings"
PARAM_SMART_TEMPERATURE_CONTROL = "smart_temperature_control"
PARAM_SYSTEM_MODE = "system_mode"

# Zigbee2MQTT Sonoff TRVZB exposes supported alongside weekly_schedule:
# https://www.zigbee2mqtt.io/devices/TRVZB.html
# Ordering: smart_temperature_control first, other settings next, system_mode applied last.
TRVZB_SETTING_KEYS: tuple[str, ...] = (
    "smart_temperature_control",
    "local_temperature_calibration",
    "temperature_accuracy",
    "frost_protection_temperature",
    "open_window",
    "child_lock",
    "valve_opening_degree",
    "valve_closing_degree",
    "temperature_sensor_select",
    "system_mode",
)

TRVZB_SETTING_DOMAINS: tuple[str, ...] = ("number", "switch", "lock", "select")

ALL_RESTORE_PARAMETER_OPTIONS: tuple[str, ...] = (
    PARAM_ALL,
    PARAM_WEEKLY_SCHEDULE,
    PARAM_SETTINGS_GROUP,
    *TRVZB_SETTING_KEYS,
)

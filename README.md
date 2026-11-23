# Sonoff TRVZB Schedule Backup

[![Validate HACS & Hassfest](https://github.com/petronovak/trv_schedule_backup/actions/workflows/validate.yaml/badge.svg)](https://github.com/petronovak/trv_schedule_backup/actions/workflows/validate.yaml)

Кастомна інтеграція для **Home Assistant** (сумісна з **HACS**), призначена для резервного копіювання, порівняння (`diff_profile`) та вибіркового відновлення тижневих розкладів і параметрів термоголовок **Sonoff TRVZB** (Zigbee2MQTT) у іменовані профілі (`heat_pump`, `solid_boiler`, `away` тощо).

## Основні можливості

- **Налаштування через UI (Config Flow + Options Flow)**: обираєте `climate.*` сутності — інтеграція автоматично знаходить 7 текстових сутностей `weekly_schedule_*` та 10 ключових параметрів TRVZB через `device_id`:
  - `smart_temperature_control` (`switch`, застосовується першим)
  - `local_temperature_calibration` (`number`)
  - `temperature_accuracy` (`number`, -1.0°C..-0.2°C, FW v1.3.0+)
  - `frost_protection_temperature` (`number`)
  - `open_window` (`switch`)
  - `child_lock` (`lock` або `switch`)
  - `valve_opening_degree` та `valve_closing_degree` (`number`)
  - `temperature_sensor_select` (`select`)
  - `system_mode` (`climate.set_hvac_mode`, застосовується останнім після запису розкладу)
- **Автоматичний страховий знімок (`_last_before_restore`)**: перед відновленням інтеграція автоматично зберігає поточні стани цільових термоголовок у `_last_before_restore`, щоб у будь-який момент можна було відкотитися назад.
- **Delta Restore (`delta_only: true`) та `diff_profile`**: порівнюйте профіль із поточним станом і записуйте лише ті сутності, які реально змінилися — це зменшує навантаження на Zigbee-мережу в рази.
- **Опціональна перевірка (`verify: true`)**: після паузи `1.5s` звіряє фактичні стани та записує розбіжності у `last_restore_result.mismatches` без повторного запису.
- **Валідація HACS & Hassfest**: у репозиторій вбудовано workflow `.github/workflows/validate.yaml` для автоматичної перевірки на GitHub.

## Встановлення через HACS

1. Відкрийте **HACS → Integrations → ⋮ → Custom repositories**.
2. Додайте URL репозиторію: `https://github.com/petronovak/trv_schedule_backup`
3. Категорія: **Integration**.
4. Натисніть **Download** та перезавантажте Home Assistant.
5. Перейдіть до **Settings → Devices & Services → Add Integration** та знайдіть **Sonoff TRVZB Schedule Backup**.

## Сервіси

### Порівняти профіль із поточним станом (`diff_profile`)
```yaml
service: trv_schedule_backup.diff_profile
data:
  profile_name: solid_boiler
response_variable: trv_diff
```

### Delta-відновлення з перевіркою та автобекапом
```yaml
service: trv_schedule_backup.restore_profile
data:
  profile_name: solid_boiler
  delta_only: true
  safety_backup: true
  verify: true
```

### Відкат до автоматичного страхового знімка
```yaml
service: trv_schedule_backup.restore_profile
data:
  profile_name: _last_before_restore
```

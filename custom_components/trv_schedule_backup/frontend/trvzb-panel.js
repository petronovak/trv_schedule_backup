/* Sonoff TRVZB Schedule Backup - Built-in Home Assistant Sidebar Panel */

const WEEKDAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const WEEKDAY_LABELS = {
  uk: {
    monday: "Пн",
    tuesday: "Вт",
    wednesday: "Ср",
    thursday: "Чт",
    friday: "Пт",
    saturday: "Сб",
    sunday: "Нд",
  },
  en: {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  },
};

const ALL_PARAMETERS = [
  {
    key: "smart_temperature_control",
    uk: "Smart temperature control (PID)",
    en: "Smart temperature control (PID)",
    group: "settings",
  },
  {
    key: "weekly_schedule",
    uk: "Тижневі розклади (Пн–Нд)",
    en: "Weekly schedules (Mon–Sun)",
    group: "schedules",
  },
  {
    key: "local_temperature_calibration",
    uk: "Калібрування температури",
    en: "Local temperature calibration",
    group: "settings",
  },
  {
    key: "temperature_accuracy",
    uk: "Temperature accuracy (гістерезис)",
    en: "Temperature accuracy (hysteresis)",
    group: "settings",
  },
  {
    key: "frost_protection_temperature",
    uk: "Захист від замерзання",
    en: "Frost protection temperature",
    group: "settings",
  },
  {
    key: "open_window",
    uk: "Виявлення відкритого вікна",
    en: "Open window detection",
    group: "settings",
  },
  {
    key: "child_lock",
    uk: "Дитячий замок (child_lock)",
    en: "Child lock",
    group: "settings",
  },
  {
    key: "valve_opening_degree",
    uk: "Макс. відкриття клапана (%)",
    en: "Valve opening degree (%)",
    group: "settings",
  },
  {
    key: "valve_closing_degree",
    uk: "Мін. закриття клапана (%)",
    en: "Valve closing degree (%)",
    group: "settings",
  },
  {
    key: "temperature_sensor_select",
    uk: "Джерело датчика температури",
    en: "Temperature sensor source",
    group: "settings",
  },
  {
    key: "system_mode",
    uk: "System mode (auto / heat / off)",
    en: "System mode (auto / heat / off)",
    group: "settings",
  },
];

const SETTING_KEYS = [
  "system_mode",
  "smart_temperature_control",
  "temperature_accuracy",
  "local_temperature_calibration",
  "frost_protection_temperature",
  "open_window",
  "child_lock",
  "valve_opening_degree",
  "valve_closing_degree",
  "temperature_sensor_select",
];

const I18N = {
  uk: {
    title: "Sonoff TRVZB Schedule Backup",
    refresh: "Оновити",
    configure: "Налаштувати TRVZB",
    profilesCount: "профілів у Store",
    devicesCount: "TRVZB підключено",
    devicesTitle: "Підключені термоголовки TRVZB (device_id)",
    devicesSub: "Оберіть термоголовку · автоматично знайдено 7 розкладів, system_mode і 9 параметрів TRVZB",
    noDevices: "Жодної термоголовки TRVZB не налаштовано. Натисніть «Налаштувати TRVZB», щоб обрати climate-сутності.",
    online: "Online",
    unavailable: "Unavailable",
    mode: "режим",
    liveTitle: "Поточні стани",
    tabSchedules: "Розклад (7)",
    tabSettings: "Параметри TRVZB (10)",
    saveBtn: "Записати",
    applyBtn: "ОК",
    saveCardTitle: "1. Зберегти резервну копію (save_profile)",
    saveCardSub: "Бекапить 7 розкладів, system_mode, smart_temperature_control, temperature_accuracy та інші параметри TRVZB",
    resetFilter: "Скинути фільтр (усі)",
    profilePlaceholder: "Назва профілю (напр. eco_away)",
    saveProfileBtn: "Зберегти профіль",
    restoreCardTitle: "2. Вибіркове відновлення (restore_profile)",
    restoreCardSub: "system_mode застосовується останнім після розкладу · verify перевіряє стани без повторів",
    pauseLabel: "пауза",
    noProfiles: "Немає збережених профілів",
    deleteBtn: "Видалити",
    confirmDeleteBtn: "Підтвердити?",
    devicesInBackup: "Термоголовки у бекапі",
    selectAll: "Обрати всі",
    clearAll: "Зняти всі",
    paramsToRestore: "Параметри для відновлення",
    allParams: "Усі",
    onlySchedules: "Лише розклад",
    onlySettings: "Лише налаштування",
    deltaOption: "Відновлювати лише відмінності (delta_only: true)",
    safetyOption: "Страховий знімок перед відновленням (_last_before_restore)",
    verifyOption: "Перевіряти стани після відновлення (verify: true)",
    diffBtn: "Порівняти (diff)",
    restoreBtn: "Відновити обране",
    restoringBtn: "Відновлення...",
    rollbackBtn: "Відкотити (_last_before_restore)",
    diffTitle: "Порівняння з живими станами",
    diffChanges: "відмінностей",
    diffUnchanged: "без змін",
    diffUnavailable: "unavailable",
    diffAllMatch: "Усі обрані параметри уже збігаються зі збереженим профілем.",
    colEntity: "Сутність / Параметр",
    colCurrent: "Поточне в HA",
    colTarget: "У профілі",
    reportTitle: "3. Звіт останнього відновлення (last_restore_result)",
    statRestored: "Записано",
    statDelta: "Без змін (delta)",
    statSkipped: "Unavailable",
    statVerify: "Перевірка",
    safetyUsed: "Створено страховий знімок:",
    mismatchesTitle: "Виявлені розбіжності (verify)",
    colExpected: "Очікувалось",
    colActual: "Фактично",
    noReport: "Ще не виконано жодного відновлення.",
    loading: "Завантаження стану Sonoff TRVZB Schedule Backup...",
  },
  en: {
    title: "Sonoff TRVZB Schedule Backup",
    refresh: "Refresh",
    configure: "Configure TRVZB",
    profilesCount: "profiles in Store",
    devicesCount: "TRVZBs connected",
    devicesTitle: "Connected TRVZB Thermostats (device_id)",
    devicesSub: "Select a thermostat · auto-discovered 7 schedules, system_mode, and 9 TRVZB settings",
    noDevices: "No TRVZB thermostats configured yet. Click Configure TRVZB to select climate entities.",
    online: "Online",
    unavailable: "Unavailable",
    mode: "mode",
    liveTitle: "Live States",
    tabSchedules: "Schedules (7)",
    tabSettings: "TRVZB Settings (10)",
    saveBtn: "Write",
    applyBtn: "OK",
    saveCardTitle: "1. Save Backup Profile (save_profile)",
    saveCardSub: "Snapshots 7 weekly schedules, system_mode, smart_temperature_control, temperature_accuracy, and all TRVZB parameters",
    resetFilter: "Reset filter (all)",
    profilePlaceholder: "Profile name (e.g. eco_away)",
    saveProfileBtn: "Save Profile",
    restoreCardTitle: "2. Selective Restore (restore_profile)",
    restoreCardSub: "system_mode is applied last after schedules · verify checks live states without retries",
    pauseLabel: "delay",
    noProfiles: "No saved profiles",
    deleteBtn: "Delete",
    confirmDeleteBtn: "Confirm?",
    devicesInBackup: "Thermostats in backup",
    selectAll: "Select all",
    clearAll: "Clear all",
    paramsToRestore: "Parameters to restore",
    allParams: "All",
    onlySchedules: "Schedules only",
    onlySettings: "Settings only",
    deltaOption: "Restore changes only (delta_only: true)",
    safetyOption: "Pre-restore safety snapshot (_last_before_restore)",
    verifyOption: "Verify restored states (verify: true)",
    diffBtn: "Compare (diff)",
    restoreBtn: "Restore Selected",
    restoringBtn: "Restoring...",
    rollbackBtn: "Rollback (_last_before_restore)",
    diffTitle: "Diff vs Live States",
    diffChanges: "differences",
    diffUnchanged: "unchanged",
    diffUnavailable: "unavailable",
    diffAllMatch: "All selected parameters already match the saved profile.",
    colEntity: "Entity / Parameter",
    colCurrent: "Live in HA",
    colTarget: "In Profile",
    reportTitle: "3. Last Restore Summary (last_restore_result)",
    statRestored: "Written",
    statDelta: "Unchanged (delta)",
    statSkipped: "Unavailable",
    statVerify: "Verify",
    safetyUsed: "Safety snapshot saved:",
    mismatchesTitle: "Verification Mismatches",
    colExpected: "Expected",
    colActual: "Actual",
    noReport: "No restore operation has been run yet.",
    loading: "Loading Sonoff TRVZB Schedule Backup...",
  },
};

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getWeekdayFromEntity(entityId) {
  const lower = entityId.toLowerCase();
  for (const day of WEEKDAY_ORDER) {
    if (lower.endsWith("_" + day) || lower.indexOf("_" + day + "_") !== -1) {
      return day;
    }
  }
  return null;
}

class TRVZBBackupPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._narrow = false;
    this._backend = null;
    this._loading = true;
    this._busy = false;
    this._lastStateSig = "";
    this._selectedDeviceId = "";
    this._deviceTab = "schedules";
    this._profileNameInput = "eco_away";
    this._saveFilter = [];
    this._restoreProfile = "";
    this._restoreDevices = [];
    this._restoreParams = ALL_PARAMETERS.map((p) => p.key);
    this._deltaOnly = false;
    this._safetyBackup = true;
    this._safetyInitialized = false;
    this._verifyAfter = false;
    this._confirmDelete = "";
    this._diffReport = null;
    this._status = null;
    this._dirtyInputs = {};
    this._boundClick = this._onClick.bind(this);
    this._boundChange = this._onChange.bind(this);
    this._boundInput = this._onInput.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", this._boundClick);
    this.shadowRoot.addEventListener("change", this._boundChange);
    this.shadowRoot.addEventListener("input", this._boundInput);
    if (this._hass && !this._backend) {
      this._fetchBackend();
    } else {
      this._render();
    }
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("click", this._boundClick);
    this.shadowRoot.removeEventListener("change", this._boundChange);
    this.shadowRoot.removeEventListener("input", this._boundInput);
  }

  set narrow(val) {
    const next = Boolean(val);
    if (this._narrow !== next) {
      this._narrow = next;
      const menuBtn = this.shadowRoot.querySelector("ha-menu-button");
      if (menuBtn) {
        menuBtn.narrow = next;
      }
    }
  }

  set hass(hass) {
    const firstHass = !this._hass;
    this._hass = hass;
    if (firstHass && this.isConnected) {
      this._fetchBackend();
      return;
    }
    const sig = this._computeStateSignature();
    if (sig !== this._lastStateSig) {
      this._lastStateSig = sig;
      this._render();
    } else {
      const menuBtn = this.shadowRoot.querySelector("ha-menu-button");
      if (menuBtn) {
        menuBtn.hass = hass;
      }
    }
  }

  _lang() {
    const lang = (this._hass && this._hass.language) || "uk";
    return lang.toLowerCase().startsWith("uk") ? "uk" : "en";
  }

  _t() {
    return I18N[this._lang()];
  }

  _computeStateSignature() {
    if (!this._hass || !this._backend) {
      return "";
    }
    const parts = [];
    for (const trv of this._backend.discovered_trvs || []) {
      const cState = this._hass.states[trv.climate_entity_id];
      parts.push(trv.climate_entity_id + "=" + (cState ? cState.state : "missing"));
      for (const sEid of trv.schedule_entities || []) {
        const sObj = this._hass.states[sEid];
        parts.push(sEid + "=" + (sObj ? sObj.state : "missing"));
      }
      for (const info of Object.values(trv.setting_entities || {})) {
        const pObj = this._hass.states[info.entity_id];
        parts.push(info.entity_id + "=" + (pObj ? pObj.state : "missing"));
      }
    }
    const sensorIds = Object.keys(this._hass.states).filter(
      (eid) =>
        eid.startsWith("select.") && eid.indexOf("active_profile") !== -1 ||
        eid.startsWith("sensor.") && eid.indexOf("saved_profiles") !== -1
    );
    for (const eid of sensorIds) {
      const st = this._hass.states[eid];
      parts.push(eid + "=" + (st ? st.state + ":" + st.last_updated : ""));
    }
    return parts.join("|");
  }

  async _fetchBackend() {
    if (!this._hass) {
      return;
    }
    try {
      const res = await this._hass.callWS({
        type: "trv_schedule_backup/get_state",
      });
      this._backend = res;
      this._loading = false;
      this._dirtyInputs = {};

      if (!this._safetyInitialized && res && res.config) {
        this._safetyBackup = Boolean(res.config.auto_safety_backup);
        this._safetyInitialized = true;
      }

      const trvs = (res && res.discovered_trvs) || [];
      if (
        trvs.length > 0 &&
        !trvs.some((d) => d.climate_entity_id === this._selectedDeviceId)
      ) {
        this._selectedDeviceId = trvs[0].climate_entity_id;
      }

      const profiles = (res && res.store && res.store.profiles) || {};
      const names = Object.keys(profiles).sort();
      if (names.length > 0 && !names.includes(this._restoreProfile)) {
        const active = res.store.active_profile;
        this._restoreProfile =
          active && names.includes(active) ? active : names[0];
        this._syncRestoreSelectionForProfile(this._restoreProfile);
      } else if (this._restoreProfile && profiles[this._restoreProfile]) {
        if (this._restoreDevices.length === 0) {
          this._syncRestoreSelectionForProfile(this._restoreProfile);
        }
      }

      this._lastStateSig = this._computeStateSignature();
      this._render();
    } catch (err) {
      this._loading = false;
      this._status = {
        type: "error",
        text: (err && err.message) || String(err),
      };
      this._render();
    }
  }

  _syncRestoreSelectionForProfile(profileName) {
    const profiles = (this._backend && this._backend.store && this._backend.store.profiles) || {};
    const prof = profiles[profileName];
    if (!prof) {
      this._restoreDevices = [];
      this._restoreParams = [];
      return;
    }
    const devs = prof.devices || {};
    this._restoreDevices = Object.keys(devs);
    const available = new Set();
    for (const dev of Object.values(devs)) {
      if (dev.schedules && Object.keys(dev.schedules).length > 0) {
        available.add("weekly_schedule");
      }
      if (dev.settings) {
        for (const k of Object.keys(dev.settings)) {
          available.add(k);
        }
      }
    }
    this._restoreParams = ALL_PARAMETERS.map((p) => p.key).filter((k) =>
      available.has(k)
    );
  }

  _navigateToIntegration() {
    window.history.pushState(
      null,
      "",
      "/config/integrations/integration/trv_schedule_backup"
    );
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  _onInput(e) {
    const target = e.target;
    if (!target) {
      return;
    }
    if (target.id === "profile-name-input") {
      this._profileNameInput = target.value;
      return;
    }
    const editId = target.getAttribute("data-edit-eid");
    if (editId) {
      this._dirtyInputs[editId] = target.value;
    }
  }

  async _onChange(e) {
    const target = e.target;
    if (!target) {
      return;
    }
    if (target.id === "restore-profile-select") {
      this._restoreProfile = target.value;
      this._confirmDelete = "";
      this._diffReport = null;
      this._syncRestoreSelectionForProfile(this._restoreProfile);
      this._render();
      return;
    }
    if (target.hasAttribute("data-restore-dev")) {
      const cid = target.getAttribute("data-restore-dev");
      if (target.checked) {
        if (!this._restoreDevices.includes(cid)) {
          this._restoreDevices = [...this._restoreDevices, cid];
        }
      } else {
        this._restoreDevices = this._restoreDevices.filter((x) => x !== cid);
      }
      this._render();
      return;
    }
    if (target.hasAttribute("data-restore-param")) {
      const pkey = target.getAttribute("data-restore-param");
      if (target.checked) {
        if (!this._restoreParams.includes(pkey)) {
          this._restoreParams = [...this._restoreParams, pkey];
        }
      } else {
        this._restoreParams = this._restoreParams.filter((x) => x !== pkey);
      }
      this._render();
      return;
    }
    if (target.id === "opt-delta") {
      this._deltaOnly = target.checked;
      this._render();
      return;
    }
    if (target.id === "opt-safety") {
      this._safetyBackup = target.checked;
      this._render();
      return;
    }
    if (target.id === "opt-verify") {
      this._verifyAfter = target.checked;
      this._render();
      return;
    }

    const directSelectEid = target.getAttribute("data-direct-select");
    if (directSelectEid && this._hass) {
      const dom = target.getAttribute("data-domain");
      const val = target.value;
      try {
        if (dom === "climate") {
          await this._hass.callService("climate", "set_hvac_mode", {
            entity_id: directSelectEid,
            hvac_mode: val,
          });
        } else if (dom === "select") {
          await this._hass.callService("select", "select_option", {
            entity_id: directSelectEid,
            option: val,
          });
        }
        this._status = {
          type: "success",
          text: directSelectEid + " → " + val,
        };
      } catch (err) {
        this._status = {
          type: "error",
          text: (err && err.message) || String(err),
        };
      }
      this._render();
    }
  }

  async _onClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) {
      return;
    }
    const action = btn.getAttribute("data-action");

    if (action === "refresh") {
      await this._fetchBackend();
      return;
    }
    if (action === "configure") {
      this._navigateToIntegration();
      return;
    }
    if (action === "select-device") {
      this._selectedDeviceId = btn.getAttribute("data-cid") || "";
      this._render();
      return;
    }
    if (action === "device-tab") {
      this._deviceTab = btn.getAttribute("data-tab") || "schedules";
      this._render();
      return;
    }
    if (action === "toggle-save-filter") {
      const cid = btn.getAttribute("data-cid");
      if (this._saveFilter.includes(cid)) {
        this._saveFilter = this._saveFilter.filter((x) => x !== cid);
      } else {
        this._saveFilter = [...this._saveFilter, cid];
      }
      this._render();
      return;
    }
    if (action === "clear-save-filter") {
      this._saveFilter = [];
      this._render();
      return;
    }
    if (action === "devices-all") {
      const prof = this._getSelectedProfile();
      this._restoreDevices = prof ? Object.keys(prof.devices || {}) : [];
      this._render();
      return;
    }
    if (action === "devices-none") {
      this._restoreDevices = [];
      this._render();
      return;
    }
    if (action === "params-preset") {
      const mode = btn.getAttribute("data-mode");
      const avail = this._getAvailableParamsForSelectedProfile();
      if (mode === "all") {
        this._restoreParams = ALL_PARAMETERS.map((p) => p.key).filter((k) =>
          avail.has(k)
        );
      } else if (mode === "schedules") {
        this._restoreParams = avail.has("weekly_schedule")
          ? ["weekly_schedule"]
          : [];
      } else if (mode === "settings") {
        this._restoreParams = ALL_PARAMETERS.filter(
          (p) => p.group === "settings" && avail.has(p.key)
        ).map((p) => p.key);
      } else {
        this._restoreParams = [];
      }
      this._render();
      return;
    }
    if (action === "close-diff") {
      this._diffReport = null;
      this._render();
      return;
    }
    if (action === "close-status") {
      this._status = null;
      this._render();
      return;
    }
    if (action === "save-entity-text") {
      const eid = btn.getAttribute("data-eid");
      const input = this.shadowRoot.querySelector(
        'input[data-edit-eid="' + eid + '"]'
      );
      if (!input || !this._hass) {
        return;
      }
      try {
        await this._hass.callService("text", "set_value", {
          entity_id: eid,
          value: input.value,
        });
        delete this._dirtyInputs[eid];
        this._status = { type: "success", text: eid + " → " + input.value };
      } catch (err) {
        this._status = {
          type: "error",
          text: (err && err.message) || String(err),
        };
      }
      this._render();
      return;
    }
    if (action === "save-entity-number") {
      const eid = btn.getAttribute("data-eid");
      const input = this.shadowRoot.querySelector(
        'input[data-edit-eid="' + eid + '"]'
      );
      if (!input || !this._hass) {
        return;
      }
      try {
        await this._hass.callService("number", "set_value", {
          entity_id: eid,
          value: Number(input.value),
        });
        delete this._dirtyInputs[eid];
        this._status = { type: "success", text: eid + " → " + input.value };
      } catch (err) {
        this._status = {
          type: "error",
          text: (err && err.message) || String(err),
        };
      }
      this._render();
      return;
    }
    if (action === "toggle-entity") {
      const eid = btn.getAttribute("data-eid");
      const dom = btn.getAttribute("data-domain");
      const curState = this._hass && this._hass.states[eid];
      const raw = curState ? String(curState.state).toLowerCase() : "";
      if (!this._hass) {
        return;
      }
      try {
        if (dom === "switch") {
          const isOn = raw === "on";
          await this._hass.callService(
            "switch",
            isOn ? "turn_off" : "turn_on",
            { entity_id: eid }
          );
        } else if (dom === "lock") {
          const isLocked = raw === "locked";
          await this._hass.callService(
            "lock",
            isLocked ? "unlock" : "lock",
            { entity_id: eid }
          );
        }
        this._status = { type: "success", text: eid + " updated" };
      } catch (err) {
        this._status = {
          type: "error",
          text: (err && err.message) || String(err),
        };
      }
      this._render();
      return;
    }
    if (action === "save-profile") {
      await this._handleSaveProfile();
      return;
    }
    if (action === "delete-profile") {
      await this._handleDeleteProfile();
      return;
    }
    if (action === "diff-profile") {
      await this._handleDiffProfile();
      return;
    }
    if (action === "restore-profile") {
      await this._handleRestoreProfile(
        this._restoreProfile,
        this._restoreDevices,
        this._restoreParams,
        this._verifyAfter,
        this._deltaOnly,
        this._safetyBackup
      );
      return;
    }
    if (action === "rollback-safety") {
      await this._handleRestoreProfile(
        "_last_before_restore",
        undefined,
        undefined,
        false,
        true,
        false
      );
    }
  }

  _getSelectedProfile() {
    const profiles = (this._backend && this._backend.store && this._backend.store.profiles) || {};
    return this._restoreProfile ? profiles[this._restoreProfile] || null : null;
  }

  _getAvailableParamsForSelectedProfile() {
    const prof = this._getSelectedProfile();
    const avail = new Set();
    if (!prof || !prof.devices) {
      return avail;
    }
    for (const dev of Object.values(prof.devices)) {
      if (dev.schedules && Object.keys(dev.schedules).length > 0) {
        avail.add("weekly_schedule");
      }
      if (dev.settings) {
        for (const k of Object.keys(dev.settings)) {
          avail.add(k);
        }
      }
    }
    return avail;
  }

  async _handleSaveProfile() {
    const name = (this._profileNameInput || "").trim();
    if (!name || !this._hass || this._busy) {
      return;
    }
    this._busy = true;
    this._render();
    try {
      const payload = { profile_name: name };
      if (this._saveFilter.length > 0) {
        payload.entities = this._saveFilter;
      }
      await this._hass.callService(
        "trv_schedule_backup",
        "save_profile",
        payload
      );
      this._restoreProfile = name;
      await this._fetchBackend();
      this._syncRestoreSelectionForProfile(name);
      this._status = {
        type: "success",
        text:
          this._lang() === "uk"
            ? "Профіль '" + name + "' збережено у .storage/trv_schedule_backup.json"
            : "Profile '" + name + "' saved to storage",
      };
    } catch (err) {
      this._status = {
        type: "error",
        text: (err && err.message) || String(err),
      };
    } finally {
      this._busy = false;
      this._render();
    }
  }

  async _handleDeleteProfile() {
    const name = this._restoreProfile;
    if (!name || !this._hass || this._busy) {
      return;
    }
    if (this._confirmDelete !== name) {
      this._confirmDelete = name;
      this._render();
      return;
    }
    this._busy = true;
    this._confirmDelete = "";
    this._render();
    try {
      await this._hass.callService("trv_schedule_backup", "delete_profile", {
        profile_name: name,
      });
      this._diffReport = null;
      this._restoreProfile = "";
      await this._fetchBackend();
      this._status = {
        type: "success",
        text:
          this._lang() === "uk"
            ? "Профіль '" + name + "' видалено"
            : "Profile '" + name + "' deleted",
      };
    } catch (err) {
      this._status = {
        type: "error",
        text: (err && err.message) || String(err),
      };
    } finally {
      this._busy = false;
      this._render();
    }
  }

  async _handleDiffProfile() {
    const name = this._restoreProfile;
    if (!name || !this._hass || this._busy) {
      return;
    }
    this._busy = true;
    this._render();
    try {
      const serviceData = { profile_name: name };
      if (this._restoreDevices.length > 0) {
        serviceData.entities = this._restoreDevices;
      }
      if (this._restoreParams.length > 0) {
        serviceData.parameters = this._restoreParams;
      }
      const res = await this._hass.callWS({
        type: "call_service",
        domain: "trv_schedule_backup",
        service: "diff_profile",
        service_data: serviceData,
        return_response: true,
      });
      const report = (res && res.response) || res;
      this._diffReport = report;
      this._status = {
        type: report.unavailable_count > 0 ? "warning" : "success",
        text:
          "Diff '" +
          name +
          "': " +
          report.diff_count +
          " / " +
          report.unchanged_count +
          " / " +
          report.unavailable_count,
      };
    } catch (err) {
      this._status = {
        type: "error",
        text: (err && err.message) || String(err),
      };
    } finally {
      this._busy = false;
      this._render();
    }
  }

  async _handleRestoreProfile(
    profileName,
    entities,
    parameters,
    verify,
    deltaOnly,
    safetyBackup
  ) {
    if (!profileName || !this._hass || this._busy) {
      return;
    }
    this._busy = true;
    this._render();
    try {
      const payload = {
        profile_name: profileName,
        verify: Boolean(verify),
        delta_only: Boolean(deltaOnly),
        safety_backup: Boolean(safetyBackup),
      };
      if (entities && entities.length > 0) {
        payload.entities = entities;
      }
      if (parameters && parameters.length > 0) {
        payload.parameters = parameters;
      }
      await this._hass.callService(
        "trv_schedule_backup",
        "restore_profile",
        payload
      );
      this._diffReport = null;
      await this._fetchBackend();
      const summary =
        this._backend &&
        this._backend.store &&
        this._backend.store.last_restore_result;
      if (summary) {
        const hasIssues =
          (summary.mismatches && summary.mismatches.length > 0) ||
          summary.skipped_count > 0 ||
          summary.failed_count > 0;
        this._status = {
          type: hasIssues ? "warning" : "success",
          text:
            this._lang() === "uk"
              ? "Відновлено '" +
                summary.profile_name +
                "': записано " +
                summary.restored_count +
                ", без змін " +
                summary.skipped_unchanged_count +
                ", unavailable " +
                summary.skipped_count
              : "Restored '" +
                summary.profile_name +
                "': written " +
                summary.restored_count +
                ", unchanged " +
                summary.skipped_unchanged_count +
                ", unavailable " +
                summary.skipped_count,
        };
      }
    } catch (err) {
      this._status = {
        type: "error",
        text: (err && err.message) || String(err),
      };
    } finally {
      this._busy = false;
      this._render();
    }
  }

  _render() {
    const t = this._t();
    const lang = this._lang();
    const backend = this._backend;
    const store = (backend && backend.store) || { profiles: {} };
    const trvs = (backend && backend.discovered_trvs) || [];
    const config = (backend && backend.config) || { restore_delay: 0.25 };
    const profiles = store.profiles || {};
    const profileNames = Object.keys(profiles).sort();
    const activeTrv =
      trvs.find((d) => d.climate_entity_id === this._selectedDeviceId) ||
      trvs[0] ||
      null;
    const selectedProfile = this._getSelectedProfile();
    const backupDeviceIds = selectedProfile
      ? Object.keys(selectedProfile.devices || {})
      : [];
    const availParamKeys = this._getAvailableParamsForSelectedProfile();
    const hasSafetyProfile = Boolean(profiles["_last_before_restore"]);
    const report = store.last_restore_result;

    const styles = [
      ":host {",
      "  display: block;",
      "  min-height: 100vh;",
      "  background: var(--primary-background-color, #111827);",
      "  color: var(--primary-text-color, #f1f5f9);",
      "  font-family: var(--paper-font-body1_-_font-family, Roboto, system-ui, -apple-system, sans-serif);",
      "  box-sizing: border-box;",
      "}",
      "* { box-sizing: border-box; }",
      ".topbar {",
      "  position: sticky; top: 0; z-index: 10;",
      "  background: var(--app-header-background-color, var(--card-background-color, #1e293b));",
      "  color: var(--app-header-text-color, var(--primary-text-color, #f8fafc));",
      "  border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.12));",
      "  padding: 12px 20px;",
      "  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;",
      "}",
      ".topbar-left { display: flex; align-items: center; gap: 10px; min-width: 0; }",
      ".topbar-title { font-size: 18px; font-weight: 700; line-height: 1.25; }",
      ".topbar-sub { font-size: 12px; opacity: 0.78; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; margin-top: 2px; }",
      ".topbar-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }",
      ".container { max-width: 1440px; margin: 0 auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }",
      ".grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 18px; align-items: start; }",
      ".col-left, .col-right { grid-column: span 6; display: flex; flex-direction: column; gap: 18px; min-width: 0; }",
      "@media (max-width: 1080px) { .col-left, .col-right { grid-column: span 12; } }",
      ".card {",
      "  background: var(--card-background-color, #1e293b);",
      "  border: 1px solid var(--divider-color, rgba(255,255,255,0.1));",
      "  border-radius: var(--ha-card-border-radius, 12px);",
      "  overflow: hidden;",
      "}",
      ".card-header {",
      "  padding: 14px 18px;",
      "  border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));",
      "  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;",
      "}",
      ".card-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }",
      ".h2 { margin: 0; font-size: 15px; font-weight: 600; }",
      ".sub { margin: 2px 0 0 0; font-size: 12px; color: var(--secondary-text-color, #94a3b8); }",
      ".mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }",
      ".btn {",
      "  appearance: none; cursor: pointer;",
      "  display: inline-flex; align-items: center; justify-content: center; gap: 6px;",
      "  padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;",
      "  border: 1px solid var(--divider-color, rgba(255,255,255,0.16));",
      "  background: transparent; color: var(--primary-text-color, #f1f5f9);",
      "  transition: opacity 0.15s ease, background 0.15s ease;",
      "}",
      ".btn:hover:not(:disabled) { background: rgba(128,128,128,0.12); }",
      ".btn:disabled { opacity: 0.48; cursor: not-allowed; }",
      ".btn-primary { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #ffffff); border-color: transparent; }",
      ".btn-primary:hover:not(:disabled) { filter: brightness(1.08); background: var(--primary-color, #03a9f4); }",
      ".btn-danger { border-color: rgba(239,68,68,0.45); color: var(--error-color, #f87171); }",
      ".btn-amber { border-color: rgba(245,158,11,0.45); color: var(--warning-color, #fbbf24); }",
      ".btn-sm { padding: 5px 10px; font-size: 11px; }",
      ".banner {",
      "  padding: 12px 16px; border-radius: 10px; font-size: 13px;",
      "  display: flex; align-items: center; justify-content: space-between; gap: 12px;",
      "  border: 1px solid transparent;",
      "}",
      ".banner-success { background: rgba(16,185,129,0.14); border-color: rgba(16,185,129,0.35); color: #34d399; }",
      ".banner-warning { background: rgba(245,158,11,0.14); border-color: rgba(245,158,11,0.35); color: #fbbf24; }",
      ".banner-error { background: rgba(239,68,68,0.14); border-color: rgba(239,68,68,0.35); color: #f87171; }",
      ".dev-row {",
      "  padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px;",
      "  border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.06));",
      "  cursor: pointer;",
      "}",
      ".dev-row:last-child { border-bottom: none; }",
      ".dev-row:hover { background: rgba(128,128,128,0.08); }",
      ".dev-row.selected { background: rgba(3,169,244,0.12); }",
      ".badge {",
      "  font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px;",
      "  border: 1px solid var(--divider-color, rgba(255,255,255,0.14)); white-space: nowrap;",
      "}",
      ".badge-ok { background: rgba(16,185,129,0.14); border-color: rgba(16,185,129,0.35); color: #34d399; }",
      ".badge-off { background: rgba(239,68,68,0.14); border-color: rgba(239,68,68,0.35); color: #f87171; }",
      ".tabs { display: inline-flex; gap: 4px; padding: 3px; border-radius: 8px; background: var(--secondary-background-color, rgba(0,0,0,0.22)); }",
      ".tab { border: none; background: transparent; color: var(--secondary-text-color, #94a3b8); padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }",
      ".tab.active { background: var(--card-background-color, #1e293b); color: var(--primary-text-color, #f8fafc); }",
      ".row-edit { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 8px; align-items: center; }",
      "@media (max-width: 640px) { .row-edit { grid-template-columns: 1fr; } }",
      ".input-group { display: flex; gap: 6px; align-items: center; }",
      "input[type=text], input[type=number], select {",
      "  width: 100%; min-width: 0; padding: 7px 10px; border-radius: 8px; font-size: 12px;",
      "  border: 1px solid var(--divider-color, rgba(255,255,255,0.16));",
      "  background: var(--secondary-background-color, rgba(0,0,0,0.24));",
      "  color: var(--primary-text-color, #f8fafc);",
      "}",
      ".chips { display: flex; flex-wrap: wrap; gap: 6px; }",
      ".chip {",
      "  padding: 5px 10px; border-radius: 8px; font-size: 11px; cursor: pointer;",
      "  border: 1px solid var(--divider-color, rgba(255,255,255,0.16));",
      "  background: var(--secondary-background-color, rgba(0,0,0,0.22)); color: var(--primary-text-color, #f1f5f9);",
      "}",
      ".chip.active { background: var(--primary-color, #03a9f4); border-color: transparent; color: #ffffff; }",
      ".check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }",
      "@media (max-width: 640px) { .check-grid { grid-template-columns: 1fr; } }",
      ".check-card {",
      "  display: flex; align-items: center; justify-content: space-between; gap: 8px;",
      "  padding: 8px 10px; border-radius: 8px; font-size: 12px; cursor: pointer;",
      "  border: 1px solid var(--divider-color, rgba(255,255,255,0.14));",
      "}",
      ".check-card.checked { border-color: var(--primary-color, #03a9f4); background: rgba(3,169,244,0.1); }",
      ".check-left { display: flex; align-items: center; gap: 8px; min-width: 0; }",
      ".trunc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }",
      ".link-btn { background: none; border: none; padding: 0; font-size: 11px; color: var(--primary-color, #38bdf8); cursor: pointer; }",
      ".link-btn:hover { text-decoration: underline; }",
      ".opt-list { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08)); }",
      ".opt-label { display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer; }",
      ".stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }",
      "@media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }",
      ".stat-box { padding: 10px 12px; border-radius: 8px; border: 1px solid var(--divider-color, rgba(255,255,255,0.1)); background: var(--secondary-background-color, rgba(0,0,0,0.18)); }",
      ".stat-val { font-size: 18px; font-weight: 700; }",
      ".stat-lbl { font-size: 11px; color: var(--secondary-text-color, #94a3b8); margin-top: 2px; }",
      "table { width: 100%; border-collapse: collapse; font-size: 12px; }",
      "th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08)); vertical-align: top; }",
      "th { color: var(--secondary-text-color, #94a3b8); font-weight: 600; font-size: 11px; }",
    ].join("\n");

    let bodyHtml = "";
    if (this._loading) {
      bodyHtml = '<div class="card"><div class="card-body">' + esc(t.loading) + "</div></div>";
    } else {
      const statusHtml = this._status
        ? '<div class="banner banner-' +
          esc(this._status.type) +
          '"><span>' +
          esc(this._status.text) +
          '</span><button class="btn btn-sm" data-action="close-status">×</button></div>'
        : "";

      const devicesRowsHtml =
        trvs.length === 0
          ? '<div class="card-body"><p class="sub">' + esc(t.noDevices) + "</p></div>"
          : trvs
              .map((trv) => {
                const cState = this._hass && this._hass.states[trv.climate_entity_id];
                const isOnline =
                  cState && cState.state !== "unavailable" && cState.state !== "unknown";
                const mode = cState ? cState.state : "unknown";
                const stcInfo = trv.setting_entities && trv.setting_entities.smart_temperature_control;
                const accInfo = trv.setting_entities && trv.setting_entities.temperature_accuracy;
                const stcState = stcInfo && this._hass.states[stcInfo.entity_id];
                const accState = accInfo && this._hass.states[accInfo.entity_id];
                const detailStr =
                  stcState && stcState.state === "on"
                    ? "PID on"
                    : accState
                    ? "accuracy " + accState.state + "°C"
                    : "";
                const isSelected =
                  activeTrv && activeTrv.climate_entity_id === trv.climate_entity_id;

                return (
                  '<div class="dev-row' +
                  (isSelected ? " selected" : "") +
                  '" data-action="select-device" data-cid="' +
                  esc(trv.climate_entity_id) +
                  '">' +
                  '<div style="min-width:0">' +
                  '<div style="font-size:14px;font-weight:600" class="trunc">' +
                  esc(trv.device_name) +
                  "</div>" +
                  '<div class="sub mono trunc">' +
                  esc(trv.climate_entity_id) +
                  " · " +
                  esc(t.mode) +
                  " " +
                  esc(mode) +
                  (detailStr ? " · " + esc(detailStr) : "") +
                  "</div>" +
                  "</div>" +
                  '<span class="badge ' +
                  (isOnline ? "badge-ok" : "badge-off") +
                  '">' +
                  esc(isOnline ? t.online : t.unavailable) +
                  "</span>" +
                  "</div>"
                );
              })
              .join("");

      let activeInspectorHtml = "";
      if (activeTrv) {
        const cState = this._hass && this._hass.states[activeTrv.climate_entity_id];
        const trvOnline =
          cState && cState.state !== "unavailable" && cState.state !== "unknown";

        let tabContentHtml = "";
        if (this._deviceTab === "schedules") {
          const labels = WEEKDAY_LABELS[lang];
          tabContentHtml = (activeTrv.schedule_entities || [])
            .map((eid) => {
              const day = getWeekdayFromEntity(eid);
              const dayLabel = day ? labels[day] : "";
              const liveState = this._hass && this._hass.states[eid];
              const liveVal = liveState ? liveState.state : "unavailable";
              const inputVal =
                eid in this._dirtyInputs ? this._dirtyInputs[eid] : liveVal;
              const disabled =
                !liveState || liveVal === "unavailable" || liveVal === "unknown";

              return (
                '<div class="row-edit">' +
                '<div class="mono trunc" style="font-size:12px" title="' +
                esc(eid) +
                '">' +
                (dayLabel
                  ? '<strong style="margin-right:6px">' + esc(dayLabel) + "</strong>"
                  : "") +
                '<span style="color:var(--secondary-text-color)">' +
                esc(eid) +
                "</span></div>" +
                '<div class="input-group">' +
                '<input type="text" class="mono" data-edit-eid="' +
                esc(eid) +
                '" value="' +
                esc(inputVal) +
                '"' +
                (disabled ? " disabled" : "") +
                ">" +
                '<button class="btn btn-sm" data-action="save-entity-text" data-eid="' +
                esc(eid) +
                '"' +
                (disabled ? " disabled" : "") +
                ">" +
                esc(t.saveBtn) +
                "</button>" +
                "</div>" +
                "</div>"
              );
            })
            .join("");
        } else {
          tabContentHtml = SETTING_KEYS.map((key) => {
            const info = activeTrv.setting_entities && activeTrv.setting_entities[key];
            if (!info) {
              return "";
            }
            const eid = info.entity_id;
            const dom = info.domain;
            const liveState = this._hass && this._hass.states[eid];
            const rawVal = liveState ? liveState.state : "unavailable";
            const disabled =
              !liveState || rawVal === "unavailable" || rawVal === "unknown";
            const paramMeta = ALL_PARAMETERS.find((p) => p.key === key);
            const label = paramMeta ? paramMeta[lang] : key;

            let controlHtml = "";
            if (dom === "climate" || dom === "select") {
              const attrs = (liveState && liveState.attributes) || {};
              const opts =
                attrs.hvac_modes ||
                attrs.options ||
                (dom === "climate"
                  ? ["auto", "heat", "off"]
                  : ["internal", "external", "external_2", "external_3"]);
              controlHtml =
                '<select class="mono" data-direct-select="' +
                esc(eid) +
                '" data-domain="' +
                esc(dom) +
                '"' +
                (disabled ? " disabled" : "") +
                ">" +
                opts
                  .map(
                    (opt) =>
                      '<option value="' +
                      esc(opt) +
                      '"' +
                      (String(opt) === String(rawVal) ? " selected" : "") +
                      ">" +
                      esc(opt) +
                      "</option>"
                  )
                  .join("") +
                "</select>";
            } else if (dom === "switch" || dom === "lock") {
              const labelVal = String(rawVal).toUpperCase();
              controlHtml =
                '<button class="btn mono" style="width:100%;justify-content:flex-start" data-action="toggle-entity" data-eid="' +
                esc(eid) +
                '" data-domain="' +
                esc(dom) +
                '"' +
                (disabled ? " disabled" : "") +
                ">" +
                esc(labelVal) +
                "</button>";
            } else {
              const attrs = (liveState && liveState.attributes) || {};
              const step = attrs.step != null ? attrs.step : 0.2;
              const minAttr = attrs.min != null ? ' min="' + esc(attrs.min) + '"' : "";
              const maxAttr = attrs.max != null ? ' max="' + esc(attrs.max) + '"' : "";
              const inputVal =
                eid in this._dirtyInputs ? this._dirtyInputs[eid] : rawVal;
              controlHtml =
                '<div class="input-group">' +
                '<input type="number" class="mono" step="' +
                esc(step) +
                '"' +
                minAttr +
                maxAttr +
                ' data-edit-eid="' +
                esc(eid) +
                '" value="' +
                esc(inputVal) +
                '"' +
                (disabled ? " disabled" : "") +
                ">" +
                '<button class="btn btn-sm" data-action="save-entity-number" data-eid="' +
                esc(eid) +
                '"' +
                (disabled ? " disabled" : "") +
                ">" +
                esc(t.applyBtn) +
                "</button>" +
                "</div>";
            }

            return (
              '<div class="row-edit">' +
              '<div style="min-width:0">' +
              '<div style="font-size:12px;font-weight:600">' +
              esc(label) +
              "</div>" +
              '<div class="sub mono trunc">' +
              esc(eid) +
              "</div>" +
              "</div>" +
              controlHtml +
              "</div>"
            );
          }).join("");
        }

        activeInspectorHtml =
          '<section class="card">' +
          '<div class="card-header">' +
          '<div style="min-width:0">' +
          '<h3 class="h2">' +
          esc(t.liveTitle) +
          ": " +
          esc(activeTrv.device_name) +
          "</h3>" +
          '<p class="sub mono">' +
          esc(activeTrv.device_id || activeTrv.climate_entity_id) +
          " · " +
          (trvOnline ? "available" : "unavailable") +
          "</p>" +
          "</div>" +
          '<div class="tabs">' +
          '<button class="tab' +
          (this._deviceTab === "schedules" ? " active" : "") +
          '" data-action="device-tab" data-tab="schedules">' +
          esc(t.tabSchedules) +
          "</button>" +
          '<button class="tab' +
          (this._deviceTab === "settings" ? " active" : "") +
          '" data-action="device-tab" data-tab="settings">' +
          esc(t.tabSettings) +
          "</button>" +
          "</div>" +
          "</div>" +
          '<div class="card-body">' +
          tabContentHtml +
          "</div>" +
          "</section>";
      }

      const saveChipsHtml = trvs
        .map((trv) => {
          const active = this._saveFilter.includes(trv.climate_entity_id);
          return (
            '<button class="chip mono' +
            (active ? " active" : "") +
            '" data-action="toggle-save-filter" data-cid="' +
            esc(trv.climate_entity_id) +
            '">' +
            esc(trv.climate_entity_id) +
            "</button>"
          );
        })
        .join("");

      const profileOptionsHtml =
        profileNames.length === 0
          ? '<option value="">' + esc(t.noProfiles) + "</option>"
          : profileNames
              .map(
                (name) =>
                  '<option value="' +
                  esc(name) +
                  '"' +
                  (name === this._restoreProfile ? " selected" : "") +
                  ">" +
                  esc(name) +
                  "</option>"
              )
              .join("");

      let restoreDetailHtml = "";
      if (selectedProfile) {
        const deviceCheckboxesHtml = backupDeviceIds
          .map((cid) => {
            const devSnap = selectedProfile.devices[cid];
            const cState = this._hass && this._hass.states[cid];
            const isOnline =
              cState && cState.state !== "unavailable" && cState.state !== "unknown";
            const checked = this._restoreDevices.includes(cid);

            return (
              '<label class="check-card' +
              (checked ? " checked" : "") +
              '">' +
              '<div class="check-left">' +
              '<input type="checkbox" data-restore-dev="' +
              esc(cid) +
              '"' +
              (checked ? " checked" : "") +
              ">" +
              '<div style="min-width:0">' +
              '<div style="font-weight:600" class="trunc">' +
              esc(devSnap.device_name || cid) +
              "</div>" +
              '<div class="sub mono trunc">' +
              esc(cid) +
              "</div>" +
              "</div>" +
              "</div>" +
              '<span class="mono" style="font-size:11px;color:' +
              (isOnline ? "#34d399" : "#f87171") +
              '">' +
              (isOnline ? "online" : "unavailable") +
              "</span>" +
              "</label>"
            );
          })
          .join("");

        const paramCheckboxesHtml = ALL_PARAMETERS.map((param) => {
          const inBackup = availParamKeys.has(param.key);
          const checked = this._restoreParams.includes(param.key);
          return (
            '<label class="check-card' +
            (checked && inBackup ? " checked" : "") +
            '" style="' +
            (inBackup ? "" : "opacity:0.45;cursor:not-allowed") +
            '">' +
            '<div class="check-left">' +
            '<input type="checkbox" data-restore-param="' +
            esc(param.key) +
            '"' +
            (checked && inBackup ? " checked" : "") +
            (inBackup ? "" : " disabled") +
            ">" +
            '<span class="trunc">' +
            esc(param[lang]) +
            "</span>" +
            "</div>" +
            "</label>"
          );
        }).join("");

        let diffHtml = "";
        if (this._diffReport) {
          const dr = this._diffReport;
          const rows =
            dr.changes && dr.changes.length > 0
              ? '<table><thead><tr><th>' +
                esc(t.colEntity) +
                "</th><th>" +
                esc(t.colCurrent) +
                "</th><th>" +
                esc(t.colTarget) +
                "</th></tr></thead><tbody>" +
                dr.changes
                  .map(
                    (c) =>
                      "<tr>" +
                      '<td class="mono"><div>' +
                      esc(c.entity_id) +
                      '</div><div class="sub">' +
                      esc(c.device_name) +
                      " · " +
                      esc(c.param_key) +
                      "</div></td>" +
                      '<td class="mono">' +
                      esc(c.current_value) +
                      "</td>" +
                      '<td class="mono" style="color:var(--primary-color, #38bdf8)">' +
                      esc(c.target_value) +
                      "</td>" +
                      "</tr>"
                  )
                  .join("") +
                "</tbody></table>"
              : '<p class="sub">' + esc(t.diffAllMatch) + "</p>";

          diffHtml =
            '<div style="border:1px solid var(--divider-color, rgba(255,255,255,0.14));border-radius:10px;overflow:hidden">' +
            '<div class="card-header">' +
            '<div><strong style="font-size:13px">' +
            esc(t.diffTitle) +
            ": " +
            esc(dr.profile_name) +
            '</strong><div class="sub mono">' +
            esc(dr.diff_count) +
            " " +
            esc(t.diffChanges) +
            " · " +
            esc(dr.unchanged_count) +
            " " +
            esc(t.diffUnchanged) +
            " · " +
            esc(dr.unavailable_count) +
            " " +
            esc(t.diffUnavailable) +
            "</div></div>" +
            '<button class="btn btn-sm" data-action="close-diff">×</button>' +
            "</div>" +
            '<div style="max-height:280px;overflow:auto">' +
            rows +
            "</div>" +
            "</div>";
        }

        const disableActions =
          this._busy ||
          this._restoreDevices.length === 0 ||
          this._restoreParams.length === 0;

        restoreDetailHtml =
          '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
          '<span style="font-size:12px;font-weight:600">' +
          esc(t.devicesInBackup) +
          " (" +
          this._restoreDevices.length +
          "/" +
          backupDeviceIds.length +
          ")</span>" +
          '<div style="display:flex;gap:10px">' +
          '<button class="link-btn" data-action="devices-all">' +
          esc(t.selectAll) +
          "</button>" +
          '<button class="link-btn" data-action="devices-none">' +
          esc(t.clearAll) +
          "</button>" +
          "</div>" +
          "</div>" +
          '<div class="check-grid">' +
          deviceCheckboxesHtml +
          "</div>" +
          "</div>" +
          '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<span style="font-size:12px;font-weight:600">' +
          esc(t.paramsToRestore) +
          " (" +
          this._restoreParams.length +
          "/" +
          availParamKeys.size +
          ")</span>" +
          '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button class="link-btn" data-action="params-preset" data-mode="all">' +
          esc(t.allParams) +
          "</button>" +
          '<button class="link-btn" data-action="params-preset" data-mode="schedules">' +
          esc(t.onlySchedules) +
          "</button>" +
          '<button class="link-btn" data-action="params-preset" data-mode="settings">' +
          esc(t.onlySettings) +
          "</button>" +
          '<button class="link-btn" data-action="params-preset" data-mode="none">' +
          esc(t.clearAll) +
          "</button>" +
          "</div>" +
          "</div>" +
          '<div class="check-grid">' +
          paramCheckboxesHtml +
          "</div>" +
          "</div>" +
          '<div class="opt-list">' +
          '<label class="opt-label"><input type="checkbox" id="opt-delta"' +
          (this._deltaOnly ? " checked" : "") +
          "><span>" +
          esc(t.deltaOption) +
          "</span></label>" +
          '<label class="opt-label"><input type="checkbox" id="opt-safety"' +
          (this._safetyBackup ? " checked" : "") +
          "><span>" +
          esc(t.safetyOption) +
          "</span></label>" +
          '<label class="opt-label"><input type="checkbox" id="opt-verify"' +
          (this._verifyAfter ? " checked" : "") +
          "><span>" +
          esc(t.verifyOption) +
          "</span></label>" +
          "</div>" +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn" data-action="diff-profile"' +
          (disableActions ? " disabled" : "") +
          ">" +
          esc(t.diffBtn) +
          "</button>" +
          '<button class="btn btn-primary" data-action="restore-profile"' +
          (disableActions ? " disabled" : "") +
          ">" +
          esc(this._busy ? t.restoringBtn : t.restoreBtn) +
          "</button>" +
          (hasSafetyProfile
            ? '<button class="btn btn-amber" data-action="rollback-safety"' +
              (this._busy ? " disabled" : "") +
              ">" +
              esc(t.rollbackBtn) +
              "</button>"
            : "") +
          "</div>" +
          diffHtml;
      }

      let reportHtml = '<p class="sub">' + esc(t.noReport) + "</p>";
      if (report) {
        const mismatchesHtml =
          report.mismatches && report.mismatches.length > 0
            ? '<div style="margin-top:6px"><div style="font-size:12px;font-weight:600;color:#fbbf24;margin-bottom:6px">' +
              esc(t.mismatchesTitle) +
              " (" +
              report.mismatches.length +
              ")</div><table><thead><tr><th>" +
              esc(t.colEntity) +
              "</th><th>" +
              esc(t.colExpected) +
              "</th><th>" +
              esc(t.colActual) +
              "</th></tr></thead><tbody>" +
              report.mismatches
                .map(
                  (m) =>
                    "<tr><td class='mono'>" +
                    esc(m.entity_id) +
                    "</td><td class='mono'>" +
                    esc(m.expected) +
                    "</td><td class='mono' style='color:#f87171'>" +
                    esc(m.actual) +
                    "</td></tr>"
                )
                .join("") +
              "</tbody></table></div>"
            : "";

        reportHtml =
          '<div class="sub mono">' +
          esc(report.profile_name) +
          " · " +
          esc(report.finished_at) +
          (report.safety_backup_profile
            ? " · " + esc(t.safetyUsed) + " " + esc(report.safety_backup_profile)
            : "") +
          "</div>" +
          '<div class="stats-grid">' +
          '<div class="stat-box"><div class="stat-val mono">' +
          esc(report.restored_count) +
          '</div><div class="stat-lbl">' +
          esc(t.statRestored) +
          "</div></div>" +
          '<div class="stat-box"><div class="stat-val mono">' +
          esc(report.skipped_unchanged_count) +
          '</div><div class="stat-lbl">' +
          esc(t.statDelta) +
          "</div></div>" +
          '<div class="stat-box"><div class="stat-val mono">' +
          esc(report.skipped_count) +
          '</div><div class="stat-lbl">' +
          esc(t.statSkipped) +
          "</div></div>" +
          '<div class="stat-box"><div class="stat-val mono">' +
          esc(report.verification_status) +
          '</div><div class="stat-lbl">' +
          esc(t.statVerify) +
          "</div></div>" +
          "</div>" +
          mismatchesHtml;
      }

      bodyHtml =
        statusHtml +
        '<div class="grid">' +
        '<div class="col-left">' +
        '<section class="card">' +
        '<div class="card-header"><div><h2 class="h2">' +
        esc(t.devicesTitle) +
        '</h2><p class="sub">' +
        esc(t.devicesSub) +
        "</p></div></div>" +
        devicesRowsHtml +
        "</section>" +
        activeInspectorHtml +
        "</div>" +
        '<div class="col-right">' +
        '<section class="card">' +
        '<div class="card-header"><div><h2 class="h2">' +
        esc(t.saveCardTitle) +
        '</h2><p class="sub">' +
        esc(t.saveCardSub) +
        "</p></div></div>" +
        '<div class="card-body">' +
        '<div class="chips">' +
        saveChipsHtml +
        (this._saveFilter.length > 0
          ? '<button class="link-btn" data-action="clear-save-filter">' +
            esc(t.resetFilter) +
            "</button>"
          : "") +
        "</div>" +
        '<div class="input-group">' +
        '<input type="text" id="profile-name-input" class="mono" value="' +
        esc(this._profileNameInput) +
        '" placeholder="' +
        esc(t.profilePlaceholder) +
        '">' +
        '<button class="btn btn-primary" data-action="save-profile"' +
        (this._busy ? " disabled" : "") +
        ">" +
        esc(t.saveProfileBtn) +
        "</button>" +
        "</div>" +
        "</div>" +
        "</section>" +
        '<section class="card">' +
        '<div class="card-header"><div><h2 class="h2">' +
        esc(t.restoreCardTitle) +
        '</h2><p class="sub">' +
        esc(t.restoreCardSub) +
        '</p></div><span class="sub mono">' +
        esc(t.pauseLabel) +
        " " +
        Number(config.restore_delay || 0.25).toFixed(2) +
        "s</span></div>" +
        '<div class="card-body">' +
        '<div class="input-group">' +
        '<select id="restore-profile-select" class="mono">' +
        profileOptionsHtml +
        "</select>" +
        '<button class="btn btn-danger" data-action="delete-profile"' +
        (this._busy || !this._restoreProfile ? " disabled" : "") +
        ">" +
        esc(
          this._confirmDelete === this._restoreProfile && this._restoreProfile
            ? t.confirmDeleteBtn
            : t.deleteBtn
        ) +
        "</button>" +
        "</div>" +
        restoreDetailHtml +
        "</div>" +
        "</section>" +
        '<section class="card">' +
        '<div class="card-header"><h2 class="h2">' +
        esc(t.reportTitle) +
        "</h2></div>" +
        '<div class="card-body">' +
        reportHtml +
        "</div>" +
        "</section>" +
        "</div>" +
        "</div>";
    }

    const subtitle =
      profileNames.length +
      " " +
      t.profilesCount +
      " · " +
      trvs.length +
      " " +
      t.devicesCount;

    const activeEl = this.shadowRoot.activeElement;
    const focusInfo = activeEl
      ? {
          id: activeEl.id || "",
          editEid: activeEl.getAttribute ? activeEl.getAttribute("data-edit-eid") || "" : "",
          start: typeof activeEl.selectionStart === "number" ? activeEl.selectionStart : null,
          end: typeof activeEl.selectionEnd === "number" ? activeEl.selectionEnd : null,
        }
      : null;

    this.shadowRoot.innerHTML =
      "<style>" +
      styles +
      "</style>" +
      '<header class="topbar">' +
      '<div class="topbar-left">' +
      "<ha-menu-button></ha-menu-button>" +
      '<div style="min-width:0">' +
      '<div class="topbar-title">' +
      esc(t.title) +
      "</div>" +
      '<div class="topbar-sub">' +
      esc(subtitle) +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="topbar-actions">' +
      '<button class="btn" data-action="refresh">' +
      esc(t.refresh) +
      "</button>" +
      '<button class="btn btn-primary" data-action="configure">' +
      esc(t.configure) +
      "</button>" +
      "</div>" +
      "</header>" +
      '<main class="container">' +
      bodyHtml +
      "</main>";

    const menuBtn = this.shadowRoot.querySelector("ha-menu-button");
    if (menuBtn) {
      menuBtn.hass = this._hass;
      menuBtn.narrow = this._narrow;
    }

    if (focusInfo && (focusInfo.id || focusInfo.editEid)) {
      const selector = focusInfo.id
        ? "#" + focusInfo.id
        : '[data-edit-eid="' + focusInfo.editEid + '"]';
      const restoredEl = this.shadowRoot.querySelector(selector);
      if (restoredEl) {
        restoredEl.focus();
        if (
          focusInfo.start !== null &&
          focusInfo.end !== null &&
          typeof restoredEl.setSelectionRange === "function"
        ) {
          try {
            restoredEl.setSelectionRange(focusInfo.start, focusInfo.end);
          } catch {
            // Ignore for number inputs that disallow setSelectionRange
          }
        }
      }
    }
  }
}

if (!customElements.get("trvzb-backup-panel")) {
  customElements.define("trvzb-backup-panel", TRVZBBackupPanel);
}

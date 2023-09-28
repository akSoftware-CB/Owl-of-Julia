// src/js/cb/cb-api.mts
var CB_USER_GROUPS = {
  owner: { userColor: "o" },
  moderator: { userColor: "m", noticeColor: "red" },
  fanclub: { userColor: "f", noticeColor: "green" },
  darkPurple: { userColor: "l", noticeColor: "darkpurple" },
  lightPurple: { userColor: "p", noticeColor: "lightpurple" },
  darkBlue: { userColor: "tr", noticeColor: "darkblue" },
  lightBlue: { userColor: "t", noticeColor: "lightblue" },
  grey: { userColor: "g", noticeColor: "red" }
};

// src/js/cli/cli-print.mts
var NOTICE_COLOR_THEME = {
  staff: {
    color: "Black",
    bgColor: "LightSteelBlue",
    fontWeight: "normal"
  },
  user: {
    color: "Black",
    bgColor: "HotPink",
    fontWeight: "normal"
  },
  error: {
    color: "White",
    bgColor: "Crimson",
    fontWeight: "normal"
  },
  userError: {
    color: "White",
    bgColor: "Crimson",
    fontWeight: "bold"
  },
  help: {
    color: "Black",
    bgColor: "Lavender",
    fontWeight: "normal"
  },
  timer: {
    color: "Black",
    bgColor: "linear-gradient(to right, rgba(255, 102, 34, 0) 5%, rgba(255, 102, 34, 0.2) 20%, rgba(255, 102, 34, 0.4) 73%, rgba(255, 102, 34, 0.2))",
    fontWeight: "normal"
  }
};
function printCommandResult(ctx, message, theme = NOTICE_COLOR_THEME.staff) {
  const { user, room, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: user.username
  };
  room.sendNotice(message, p);
}
function printToOwner(ctx, message, theme = NOTICE_COLOR_THEME.staff) {
  const { user, room, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: room.owner
  };
  room.sendNotice(message, p);
}
function printToUser(ctx, message, username, theme = NOTICE_COLOR_THEME.userError) {
  const { user = null, room, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: username
  };
  room.sendNotice(message, p);
}
function printToEveryone(ctx, message, theme = NOTICE_COLOR_THEME.user) {
  const { user = null, room, kv = null } = ctx;
  const p = {
    ...theme
  };
  room.sendNotice(message, p);
}

// src/js/defaults.mts
var COMMAND_START_CHAR = "!";
var BASE_STAFF_COMMAND = "!zeus";
var BASE_USER_COMMAND = "!jarvis";
var CB_SETTINGS_LIST_SEPARATOR = ",";
var AVAILLABLE_LIVE_SETTINGS_NAMES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20"
];

// src/js/tool/kv.mts
var KV_KEYS = {
  liveSettings: "liveSettings",
  sessionStartDate: "sessionStartDate",
  sessionLastEnterDate: "sessionLastEnterDate",
  sessionLastLeaveDate: "sessionLastLeaveDate",
  currentSession: "currentSession",
  sessionHistory: "sessionHistory",
  callbacksManager: "callbacksManager",
  userTipsKeysMap: "userTipsKeysMap",
  userChatKeysMap: "userChatKeysMap",
  currentGlobalStatsTS: "currentGlobalStatsTS",
  ModuleTimer: "ModuleTimer"
};

// src/js/settings.mts
var SETTINGS_CONVERT = {
  number: "number",
  listString: "listString",
  boolean: "boolean"
};
var SETTINGS_INFO = {
  cliBroadcastUserCmd: {
    defaultValue: false,
    desc: "Broadcast User command to everyone in chat",
    fromSettings: false,
    liveUpdate: true,
    convert: SETTINGS_CONVERT.boolean
  },
  cliBroadcastStaffCmd: {
    defaultValue: false,
    desc: "Broadcast Amdin command to everyone in chat",
    fromSettings: false
  },
  cliBaseStaffCommand: {
    defaultValue: BASE_STAFF_COMMAND,
    fromSettings: true,
    desc: "Command prefix for Staff commands"
  },
  cliBaseUserCommand: {
    defaultValue: BASE_USER_COMMAND,
    fromSettings: true,
    desc: "Command prefix for User commands"
  },
  debugAllowedUsernames: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    desc: "username of the user allowed to use debug commands"
  },
  debugEnableRemoteUser: {
    defaultValue: false,
    fromSettings: true,
    desc: "allowing a remote user to use debug commands"
  },
  debugAllowOwner: {
    defaultValue: false,
    fromSettings: true,
    desc: "allowing room owner to use debug commands"
  },
  userStaffMembersAdmin: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    desc: "staff users allowed to use Staff/privileged commands"
  },
  userStaffMembersMonitor: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    liveUpdate: true,
    desc: "staff users only allowed monitoring commands"
  },
  sessionMinTimeBetweenSession: {
    defaultValue: 2 * 60,
    fromSettings: true,
    desc: "Minimum time between 2 different sessions (default 2h)"
  },
  sessionMaxTimeToRejoin: {
    defaultValue: 30,
    fromSettings: true,
    desc: "Maximum time to rejoin a session, to keep same session (default 30min)"
  },
  sessionMaxSessionLength: {
    defaultValue: 8 * 60,
    fromSettings: true,
    desc: "How much time a session will last (default 8h)"
  },
  sessionHistoryMaxLength: {
    defaultValue: 10,
    fromSettings: false,
    desc: "How many sessions to keep in history"
  },
  chatBadWords: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    liveUpdate: false,
    desc: "words that will be removed from chat message"
  },
  chatFuzzyScoreForBW: {
    defaultValue: 60,
    fromSettings: true,
    liveUpdate: false,
    desc: "minimal fuzzy similarity score to consider word is BW, range 0-100, 0 to disable"
  },
  chatVeryBadWords: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    liveUpdate: false,
    desc: "if chat message contains one of those words, message is spammed"
  },
  chatFuzzyScoreForVBW: {
    defaultValue: 60,
    fromSettings: true,
    liveUpdate: false,
    desc: "minimal fuzzy similarity score to consider word is VBW, range 0-100, 0 to disable"
  },
  chatNoticeToUserVBW: {
    defaultValue: "Be Polite, Please ! No bad words !",
    fromSettings: true,
    liveUpdate: false,
    desc: "Notice to send to user using very bad words"
  }
};
function getSettings() {
  const settings = {};
  Object.entries(SETTINGS_INFO).forEach(([n, sInfo]) => {
    const {
      defaultValue = null,
      desc = null,
      fromSettings = null,
      forceUpdate = null,
      liveUpdate = null,
      convert = null
    } = sInfo;
    const name = n;
    if (name) {
      settings[name] = defaultValue;
      if (fromSettings) {
        let key = name;
        switch (typeof fromSettings) {
          case "boolean":
            key = name;
            break;
          case "string":
            key = fromSettings;
            break;
          default:
            break;
        }
        try {
          const v = $settings[key];
          if (v || forceUpdate) {
            if (convert && v) {
              let c = null;
              let l = null;
              let nv = null;
              switch (convert) {
                case SETTINGS_CONVERT.number:
                  c = parseInt(v);
                  if (typeof c === "number" && c) {
                    settings[name] = c;
                  } else {
                    settings[name] = defaultValue;
                  }
                  break;
                case SETTINGS_CONVERT.listString:
                  l = v.split(CB_SETTINGS_LIST_SEPARATOR);
                  nv = [];
                  l.forEach((u) => {
                    nv.push(u.trim());
                  });
                  settings[name] = nv;
                  break;
                default:
                  settings[name] = v;
                  break;
              }
            } else {
              settings[name] = v;
            }
          }
        } catch (ReferenceError) {
          settings[name] = defaultValue;
        }
      }
      if (liveUpdate) {
        const liveSettings = $kv.get(KV_KEYS.liveSettings, {});
        if (Object.hasOwn(liveSettings, name)) {
          const v = settings[name];
          const nv = liveSettings[name];
          if (Array.isArray(v) && Array.isArray(nv)) {
            settings[name] = v.concat(nv);
          } else {
            settings[name] = nv;
          }
        }
      }
    }
  });
  return settings;
}
function updateSettings() {
  SETTINGS = getSettings();
}
var SETTINGS = getSettings();
updateSettings();

// src/js/tool/tool.mts
function getRandomInt(min, max) {
  const tMin = Math.ceil(min);
  const tMax = Math.floor(max);
  return Math.floor(Math.random() * (tMax - tMin) + tMin);
}
function getRandomID(strengh = 2) {
  const il = [];
  for (let index = 0; index < strengh; index++) {
    il.push(getRandomInt(0, 1048576));
  }
  let id = "";
  il.forEach((element) => {
    id = id + element.toString(16);
  });
  return id;
}
function getObjectProperty(obj, prop, defaultValue = null, updateObject = true) {
  if (Object.hasOwn(obj, prop)) {
    return obj[prop];
  } else {
    if (updateObject) {
      obj[prop] = defaultValue;
    }
    return defaultValue;
  }
}

// src/js/app-module/UserTipInfo.mts
var UserTipInfo = class _UserTipInfo {
  tipList;
  tipTotal;
  userName;
  sessionID;
  key;
  constructor(ctx, userName) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    this.tipList = [];
    this.tipTotal = 0;
    this.userName = userName;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.key = _UserTipInfo.getUserTipKey(ctx, userName);
  }
  static getFromKV(ctx, userName) {
    const userTipInfo = new _UserTipInfo(ctx, userName);
    userTipInfo.loadFromKV(ctx);
    return userTipInfo;
  }
  static getUserTipKey(ctx, userName) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    let key = null;
    const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
    if (Object.hasOwn(keysMap, userName)) {
      key = keysMap[userName];
    } else {
      key = userName + "-" + getRandomID(4);
      keysMap[userName] = key;
      kv.set(KV_KEYS.userTipsKeysMap, keysMap);
    }
    return key;
  }
  static updateUserTips(ctx) {
    const { message = null, user, room = null, kv = null, tip = null } = ctx;
    const userName = user.username;
    const userTipInfo = _UserTipInfo.getFromKV(ctx, userName);
    userTipInfo.addTip(ctx);
    userTipInfo.storeToKV(ctx);
  }
  static clearAll(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
    const keyList = Object.values(keysMap);
    keyList.forEach((key) => {
      kv.remove(key);
    });
    kv.remove(KV_KEYS.userTipsKeysMap);
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const userTipInfo = kv.get(this.key, null);
    if (userTipInfo) {
      this.tipList = userTipInfo.tipList;
      this.tipTotal = userTipInfo.tipTotal;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.set(this.key, this);
  }
  addTip(ctx) {
    const { message = null, user, room = null, kv = null, tip } = ctx;
    const extendedTip = {
      tokens: tip.tokens,
      message: tip.message,
      isAnon: tip.isAnon,
      date: Date.now(),
      userName: user.username,
      sessionID: this.sessionID
    };
    this.tipList.push(extendedTip);
    this.tipTotal = this.tipTotal + tip.tokens;
  }
  toString() {
    let m = "";
    m = m + JSON.stringify(this.tipList);
    m = m + "\n" + JSON.stringify(this.tipTotal);
    return m;
  }
};

// src/js/app-module/GlobalStatsTimeSeries.mts
var GlobalStatsTimeSeries = class _GlobalStatsTimeSeries {
  sessionID;
  timeSeries;
  tsMetadata;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.timeSeries = {};
    this.tsMetadata = {};
  }
  static TS_TYPES;
  static TS_METADATA;
  static DEFAULT_TS_METADATA = {
    userTips: {
      size: 300,
      span: 6e4
    },
    message: {
      size: 300,
      span: 6e4
    }
  };
  static FALLBACK_TS_SIZE = 300;
  // number of buckets in TS
  static FALLBACK_TS_SPAN = 6e4;
  // duration of "bucket" in TS
  static getFromKV(ctx) {
    const globalTipStat = new _GlobalStatsTimeSeries(ctx);
    globalTipStat.loadFromKV(ctx);
    return globalTipStat;
  }
  static initNewStatObj(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.remove(KV_KEYS.currentGlobalStatsTS);
    const globalStatsTS = new _GlobalStatsTimeSeries(ctx);
    globalStatsTS.storeToKV(ctx);
    return globalStatsTS;
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const globalTipStat = kv.get(KV_KEYS.currentGlobalStatsTS, null);
    if (globalTipStat) {
      this.timeSeries = globalTipStat.timeSeries;
      this.tsMetadata = globalTipStat.tsMetadata;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.set(KV_KEYS.currentGlobalStatsTS, this);
  }
  getTimeSerieNames(tsType) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    return Object.keys(allTS);
  }
  getTimeSerie(tsType, tsName) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    if (Object.hasOwn(allTS, tsName)) {
      return allTS[tsName];
    } else {
      return this.initTimeSerie(tsType, tsName);
    }
  }
  initTimeSerie(tsType, tsName) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    const nbucket = this.getTimeSerieSize(tsType, tsName);
    const list = new Array(nbucket);
    list.fill(0);
    allTS[tsName] = list;
    let newRefDate = 0;
    let trd = 0;
    const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    Object.keys(allTSmetadata).forEach((tsName2) => {
      trd = this.getTimeSerieMetadata(
        tsType,
        tsName2,
        "refDate" /* refDate */,
        0
      );
      if (trd > newRefDate) {
        newRefDate = trd;
      }
    });
    if (newRefDate === 0) {
      const span = this.getTimeSerieSpan(tsType, tsName);
      newRefDate = Date.now() + span;
    }
    this.setTimeSerieMetadata(
      tsType,
      tsName,
      "refDate" /* refDate */,
      newRefDate
    );
    return list;
  }
  getTimeSerieSize(tsType, tsName) {
    return this.getTimeSerieMetadata(
      tsType,
      tsName,
      "size" /* size */,
      _GlobalStatsTimeSeries.FALLBACK_TS_SIZE
    );
  }
  getTimeSerieSpan(tsType, tsName) {
    return this.getTimeSerieMetadata(
      tsType,
      tsName,
      "span" /* span */,
      _GlobalStatsTimeSeries.FALLBACK_TS_SPAN
    );
  }
  getTimeSerieMetadata(tsType, tsName, metadataType, fallbackValue) {
    const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    const metadataObj = getObjectProperty(allTSmetadata, tsName, {});
    const typeDefaultValues = getObjectProperty(
      _GlobalStatsTimeSeries.DEFAULT_TS_METADATA,
      tsType,
      {},
      false
    );
    const defaultValue = getObjectProperty(typeDefaultValues, metadataType, fallbackValue, false);
    const metadata = getObjectProperty(
      metadataObj,
      metadataType,
      defaultValue
    );
    return metadata;
  }
  setTimeSerieMetadata(tsType, tsName, metadataType, newValue) {
    const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    const metadataObj = getObjectProperty(allTSmetadata, tsName, {});
    metadataObj[metadataType] = newValue;
  }
  slideAllTimeSeries(currentDate, tsType) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    Object.keys(allTS).forEach((tsName) => {
      this.slideTimeSeries(currentDate, tsType, tsName);
    });
  }
  slideTimeSeries(currentDate, tsType, tsName) {
    const refDate = this.getTimeSerieMetadata(
      tsType,
      tsName,
      "refDate" /* refDate */,
      0
    );
    const span = this.getTimeSerieSpan(tsType, tsName);
    if (refDate === 0) {
      this.setTimeSerieMetadata(
        tsType,
        tsName,
        "refDate" /* refDate */,
        currentDate + span
      );
    } else if (currentDate - refDate >= 0) {
      const nbucket = Math.ceil((currentDate - refDate) / span);
      const allTS = getObjectProperty(this.timeSeries, tsType, {});
      Object.values(allTS).forEach((list) => {
        for (let i = 0; i < nbucket; i++) {
          list.unshift(0);
          list.pop();
        }
      });
      this.setTimeSerieMetadata(
        tsType,
        tsName,
        "refDate" /* refDate */,
        refDate + nbucket * span
      );
    }
  }
  processTip(userName, tip) {
    const tsType = "userTips" /* userTips */;
    const span = this.getTimeSerieSpan(tsType, userName);
    const list = this.getTimeSerie(tsType, userName);
    const refDate = this.getTimeSerieMetadata(
      tsType,
      userName,
      "refDate" /* refDate */,
      0
    );
    const maxDate = this.getTimeSerieMetadata(
      tsType,
      userName,
      "maxDate" /* maxDate */,
      0
    );
    if (tip.date > maxDate) {
      const idx = Math.floor((refDate - tip.date) / span);
      list[idx] = list[idx] + tip.tokens;
      this.setTimeSerieMetadata(
        tsType,
        userName,
        "maxDate" /* maxDate */,
        tip.date
      );
    }
  }
};

// src/js/tip-management.mts
function tipUpdateStatData(ctx) {
  const { message = null, user = null, room = null, kv, tip = null } = ctx;
  const globalTipStat = GlobalStatsTimeSeries.getFromKV(ctx);
  const currentDate = Date.now();
  globalTipStat.slideAllTimeSeries(currentDate, "userTips" /* userTips */);
  const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
  const keyList = Object.keys(keysMap);
  keyList.forEach((userName) => {
    const userTipInfo = UserTipInfo.getFromKV(ctx, userName);
    let extendedTip = {};
    while (typeof (extendedTip = userTipInfo.tipList.shift()) !== "undefined") {
      globalTipStat.processTip(userName, extendedTip);
    }
    userTipInfo.storeToKV(ctx);
  });
  globalTipStat.storeToKV(ctx);
}

// src/js/app-module/UserChatInfo.mts
var UserChatInfo = class _UserChatInfo {
  userName;
  sessionID;
  key;
  pendingNotices;
  constructor(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    this.userName = userName;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.key = _UserChatInfo.getUserChatKey(ctx, userName);
    this.pendingNotices = [];
  }
  static getFromKV(ctx, userName) {
    const userChatInfo = new _UserChatInfo(ctx, userName);
    userChatInfo.loadFromKV(ctx);
    return userChatInfo;
  }
  static getUserChatKey(ctx, userName) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    let key = null;
    const keysMap = kv.get(KV_KEYS.userChatKeysMap, {});
    if (Object.hasOwn(keysMap, userName)) {
      key = keysMap[userName];
    } else {
      key = userName + "-" + getRandomID(4);
      keysMap[userName] = key;
      kv.set(KV_KEYS.userChatKeysMap, keysMap);
    }
    return key;
  }
  // TODO improve pending notice from string to object
  static addPendingNotice(ctx, userName, futureNotice) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const userChatInfo = _UserChatInfo.getFromKV(ctx, userName);
    userChatInfo.addNotice(ctx, futureNotice);
    userChatInfo.storeToKV(ctx);
  }
  static sendPendingNotices(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const userChatInfo = _UserChatInfo.getFromKV(ctx, userName);
    let notice = "";
    while (typeof (notice = userChatInfo.pendingNotices.shift()) !== "undefined") {
      printToUser(ctx, notice, userName, NOTICE_COLOR_THEME.userError);
    }
    userChatInfo.storeToKV(ctx);
  }
  static clearAll(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const keysMap = kv.get(KV_KEYS.userChatKeysMap, {});
    const keyList = Object.values(keysMap);
    keyList.forEach((key) => {
      kv.remove(key);
    });
    kv.remove(KV_KEYS.userChatKeysMap);
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const userChatInfo = kv.get(this.key, null);
    if (userChatInfo) {
      this.pendingNotices = userChatInfo.pendingNotices;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.set(this.key, this);
  }
  addNotice(ctx, futureNotice) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    this.pendingNotices.push(futureNotice);
  }
};

// src/js/tool/log.mts
function logIt(message) {
  const stack = new Error().stack;
  const caller = stack.split("\n")[2].trim().split(/\s+/)[1];
  if (typeof message === "object") {
    console.log(message);
    console.log("Caller ----> " + caller);
  } else {
    console.log(message + "\nCaller ----> " + caller);
  }
}

// src/js/session-management.mts
function sessionManageEnter(ctx, force = false) {
  const { user = null, room = null, kv } = ctx;
  const currentDate = Date.now();
  const lastStart = kv.get(KV_KEYS.sessionStartDate, 0);
  const lastEnter = kv.get(KV_KEYS.sessionLastEnterDate, 0);
  const lastLeave = kv.get(KV_KEYS.sessionLastLeaveDate, 0);
  const minTimeBetweenSession = SETTINGS.sessionMinTimeBetweenSession * 60 * 1e3;
  const maxTimeToRejoin = SETTINGS.sessionMaxTimeToRejoin * 60 * 1e3;
  const maxSessionLength = SETTINGS.sessionMaxSessionLength * 60 * 1e3;
  function createNewSession(first) {
    const sObj = kv.get(KV_KEYS.currentSession, null);
    if (sObj) {
      tipUpdateStatData(ctx);
    }
    UserTipInfo.clearAll(ctx);
    UserChatInfo.clearAll(ctx);
    Session.initNewSession(ctx, currentDate, first);
    GlobalStatsTimeSeries.initNewStatObj(ctx);
    const manager = CallbacksManager.initNewManager(ctx);
    manager.createAllDefaults(ctx);
    manager.storeToKV(ctx);
  }
  let keepSession = 0;
  let newSession = 0;
  let info = "";
  if (lastStart && lastEnter) {
    if (currentDate - lastLeave < maxTimeToRejoin) {
      keepSession = keepSession + 1;
      info = info + "A";
    }
    if (currentDate - lastEnter < maxTimeToRejoin + maxSessionLength) {
      keepSession = keepSession + 1;
      info = info + "B";
    }
    if (currentDate - lastStart < maxTimeToRejoin + maxSessionLength) {
      keepSession = keepSession + 1;
      info = info + "C";
    }
    if (currentDate - lastLeave > minTimeBetweenSession) {
      newSession = newSession + 1;
      info = info + "G";
    }
    if (currentDate - lastEnter > minTimeBetweenSession + maxSessionLength) {
      newSession = newSession + 1;
      info = info + "H";
    }
    if (currentDate - lastStart > minTimeBetweenSession + maxSessionLength) {
      newSession = newSession + 1;
      info = info + "I";
    }
    if (newSession > keepSession || force) {
      printToOwner(ctx, "Will create a new session. " + keepSession + newSession + info);
      createNewSession(false);
    } else {
      printToOwner(ctx, "Keeping existing session from: " + new Date(lastStart).toString());
    }
  } else {
    printToOwner(ctx, "Hello, you are new user :-)");
    createNewSession(true);
  }
  kv.set(KV_KEYS.sessionLastEnterDate, currentDate);
}
function sessionManageLeave(ctx) {
  const { user = null, room = null, kv } = ctx;
  const currentDate = Date.now();
  kv.set(KV_KEYS.sessionLastLeaveDate, currentDate);
}
var Session = class _Session {
  sessionID;
  startDate;
  constructor(currentDate) {
    this.sessionID = getRandomID(8);
    this.startDate = currentDate;
  }
  static getCurrentSession(ctx) {
    const { user = null, room = null, kv } = ctx;
    let sObj = kv.get(KV_KEYS.currentSession);
    if (!sObj) {
      sessionManageEnter(ctx);
      sObj = kv.get(KV_KEYS.currentSession);
    }
    return sObj;
  }
  static initNewSession(ctx, currentDate = null, first = false) {
    const { user = null, room = null, kv } = ctx;
    let startDate = currentDate;
    if (!startDate) {
      startDate = Date.now();
    }
    if (first) {
      logIt("First session");
      kv.set(KV_KEYS.sessionStartDate, startDate);
      kv.set(KV_KEYS.sessionLastEnterDate, startDate);
      kv.set(KV_KEYS.sessionLastLeaveDate, 0);
    } else {
      kv.set(KV_KEYS.sessionStartDate, startDate);
    }
    const previousSession = kv.get(KV_KEYS.currentSession, null);
    const newSession = new _Session(startDate);
    kv.set(KV_KEYS.currentSession, newSession);
    if (previousSession) {
      const tl = kv.get(KV_KEYS.sessionHistory, []);
      const count = tl.unshift(newSession);
      if (count > SETTINGS.sessionHistoryMaxLength) {
        tl.pop();
      }
      kv.set(KV_KEYS.sessionHistory, tl);
    }
    printToOwner(ctx, "New Session created :-)");
  }
  static clear(ctx) {
    const { user = null, room = null, kv } = ctx;
    kv.remove(KV_KEYS.sessionStartDate);
    kv.remove(KV_KEYS.sessionLastEnterDate);
    kv.remove(KV_KEYS.sessionLastLeaveDate);
    kv.remove(KV_KEYS.currentSession);
  }
};

// src/js/app-module/CallbacksManager.mts
var CALLBACKS_INFO = {
  tipUpdateStatData: {
    enabled: true,
    func: tipUpdateStatData,
    defaultDelay: 5,
    defaultRepeating: true
  }
};
var CallbacksManager = class _CallbacksManager {
  sessionID;
  activeCallbacks;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.activeCallbacks = {};
  }
  static getFromKV(ctx) {
    const manager = new _CallbacksManager(ctx);
    manager.loadFromKV(ctx);
    return manager;
  }
  static initNewManager(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const oldManager = this.getFromKV(ctx);
    oldManager.cancelAll(ctx);
    kv.remove(KV_KEYS.callbacksManager);
    const newManager = new _CallbacksManager(ctx);
    newManager.storeToKV(ctx);
    return newManager;
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const manager = kv.get(KV_KEYS.callbacksManager, null);
    if (manager) {
      this.activeCallbacks = manager.activeCallbacks;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.set(KV_KEYS.callbacksManager, this);
  }
  createAllDefaults(ctx) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
    Object.keys(CALLBACKS_INFO).forEach((label) => {
      const cInfo = CALLBACKS_INFO[label];
      if (cInfo.enabled) {
        this.create(
          ctx,
          label,
          cInfo.defaultDelay,
          cInfo.defaultRepeating,
          null
        );
      }
    });
  }
  create(ctx, label, delay = null, repeating = null, copyFrom = null) {
    const { callback, user = null, room = null, kv = null, tip = null } = ctx;
    let cInfo = null;
    let baseCallback = null;
    if (copyFrom) {
      cInfo = getObjectProperty(CALLBACKS_INFO, copyFrom, null);
      baseCallback = copyFrom;
    } else {
      cInfo = getObjectProperty(CALLBACKS_INFO, label, null);
      baseCallback = label;
    }
    if (cInfo) {
      const d = delay ? delay : cInfo.defaultDelay;
      const r = repeating != null ? repeating : cInfo.defaultRepeating;
      callback.create(label, d, r);
      this.activeCallbacks[label] = {
        label,
        baseCallback,
        defaultDelay: d,
        defaultRepeating: r
      };
    }
  }
  cancel(ctx, label) {
    const { callback, user = null, room = null, kv = null, tip = null } = ctx;
    callback.cancel(label);
    delete this.activeCallbacks[label];
  }
  cancelAll(ctx) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
    Object.keys(this.activeCallbacks).forEach((label) => {
      this.cancel(ctx, label);
    });
  }
  onEvent(ctx) {
    const { callback, user = null, room = null, kv = null, tip = null } = ctx;
    const label = callback.label;
    const aInfo = getObjectProperty(this.activeCallbacks, label, null);
    if (aInfo) {
      const bInfo = getObjectProperty(CALLBACKS_INFO, aInfo.baseCallback, null);
      if (bInfo && bInfo.func) {
        logIt(aInfo);
        if (!aInfo.defaultRepeating) {
          delete this.activeCallbacks[label];
          this.storeToKV(ctx);
        }
        bInfo.func(ctx);
      }
    }
  }
};

// src/js/app-module/ModuleBase.mts
var ModuleBase = class {
  sessionID;
  data;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // ['constructor']: typeof ModuleBase;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.data = {};
  }
  static PERSIST_PROPERTIES = ["data"];
  static NAMES_IN_SETTINGS = null;
  static CALLBACK_NAME = null;
  static SETTING_BASENAME = null;
  static CALLBACK_TEMPLATE = null;
  static SETTINGS_INFO = null;
  static getFromKV(ctx, classClass = this) {
    const module = new classClass(ctx);
    module.loadFromKV(ctx);
    return module;
  }
  static getSettingName(settingName, name) {
    return this.SETTING_BASENAME + "__" + settingName + "__" + name;
  }
  static extendSettings() {
    if (this.NAMES_IN_SETTINGS && this.SETTING_BASENAME && this.SETTINGS_INFO) {
      this.NAMES_IN_SETTINGS.forEach((name) => {
        Object.entries(this.SETTINGS_INFO).forEach(([settingName, sInfo]) => {
          const newName = this.getSettingName(settingName, name);
          const newObj = {
            ...sInfo
          };
          SETTINGS_INFO[newName] = newObj;
        });
      });
    }
  }
  static extendCallback() {
    if (this.CALLBACK_NAME && this.CALLBACK_TEMPLATE) {
      CALLBACKS_INFO[this.CALLBACK_NAME] = this.CALLBACK_TEMPLATE;
    }
  }
  static getStaticSettings() {
    const staticSettings = {};
    let settingObj = {};
    this.NAMES_IN_SETTINGS.forEach((name) => {
      settingObj = { name };
      Object.entries(this.SETTINGS_INFO).forEach(([sName]) => {
        const settingName = this.getSettingName(sName, name);
        settingObj[sName] = SETTINGS[settingName];
      });
      staticSettings[name] = settingObj;
    });
    return staticSettings;
  }
  getKVKey() {
    return this.constructor.name;
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const kvKey = this.getKVKey();
    if (this.constructor.PERSIST_PROPERTIES) {
      const module = kv.get(kvKey, null);
      if (module) {
        this.constructor.PERSIST_PROPERTIES.forEach((propName) => {
          this[propName] = module[propName];
        });
      }
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const kvKey = this.getKVKey();
    kv.set(kvKey, this);
  }
};

// src/js/app-module/ModuleChatFilter.mts
var LEET_TABLE = {
  a: ["@", "4"],
  b: ["8"],
  c: ["("],
  e: ["3"],
  g: ["6"],
  h: ["#"],
  i: ["!", "1"],
  l: ["1"],
  o: ["0"],
  s: ["$"],
  t: ["7"],
  z: ["2"]
};
var ModuleChatFilter = class extends ModuleBase {
  onMessage(ctx) {
    const { message = null, user, kv = null } = ctx;
    const userName = user.username;
    UserChatInfo.sendPendingNotices(ctx, userName);
  }
  onMessageTransform(ctx) {
    const { message, user, kv = null } = ctx;
    let wordRegexString = "([a-zA-Z\xE0-\xFC\xC0-\xDC";
    Object.values(LEET_TABLE).forEach((l) => {
      l.forEach((c) => {
        wordRegexString = wordRegexString.concat(c);
      });
    });
    wordRegexString = wordRegexString.concat("])+");
    let wordRegex = /([a-zA-Zà-üÀ-Ü])+/g;
    wordRegex = new RegExp(wordRegexString, "g");
    const words = message.orig.match(wordRegex);
    function leetChar(chr) {
      let rl = [];
      if (Object.hasOwn(LEET_TABLE, chr.toLowerCase())) {
        rl.push(chr);
        rl = rl.concat(LEET_TABLE[chr.toLowerCase()]);
      } else {
        rl.push(chr);
      }
      return rl;
    }
    function leetString(str) {
      const rl = [];
      if (str.length > 1) {
        leetChar(str[0]).forEach((e1) => {
          leetString(str.substring(1)).forEach((e2) => {
            rl.push(e1.concat(e2));
          });
        });
      }
      if (str.length === 1) {
        leetChar(str[0]).forEach((e1) => {
          rl.push(e1);
        });
      } else {
        rl.push(str);
      }
      return rl;
    }
    function stringSimilarity(str1, str2, gramSize = 3) {
      function getNGrams(s, len) {
        s = " ".repeat(len - 1) + s.toLowerCase() + " ".repeat(len - 1);
        const v = new Array(s.length - len + 1);
        for (let i = 0; i < v.length; i++) {
          v[i] = s.slice(i, i + len);
        }
        return v;
      }
      if (!(str1 === null || str1 === void 0 ? void 0 : str1.length) || !(str2 === null || str2 === void 0 ? void 0 : str2.length)) {
        return 0;
      }
      const s1 = str1.length < str2.length ? str1 : str2;
      const s2 = str1.length < str2.length ? str2 : str1;
      const pairs1 = getNGrams(s1, gramSize);
      const pairs2 = getNGrams(s2, gramSize);
      const set = new Set(pairs1);
      const total = pairs2.length;
      let hits = 0;
      for (let item of pairs2) {
        if (set.delete(item)) {
          hits++;
        }
      }
      return hits * 100 / total;
    }
    function compareWord(word, badWord, collator, fuzzyScoreMin) {
      if (collator.compare(word, badWord) === 0) {
        return badWord;
      }
      const bwl = leetString(badWord);
      bwl.forEach((ebw) => {
        if (collator.compare(word, ebw) === 0) {
          return ebw;
        }
      });
      let found = false;
      found = bwl.some((ebw) => {
        if (collator.compare(word, ebw) === 0) {
          return ebw;
        } else {
          return false;
        }
      });
      if (found) {
        return found;
      }
      if (fuzzyScoreMin > 0) {
        if (stringSimilarity(badWord, word) > fuzzyScoreMin) {
          return badWord;
        }
        found = false;
        found = bwl.some((ebw) => {
          if (stringSimilarity(ebw, word) > fuzzyScoreMin) {
            return ebw;
          } else {
            return false;
          }
        });
        if (found) {
          return found;
        }
      }
      return false;
    }
    function searchBadWord(wordsList, badWordList, fuzzyScoreMin) {
      const collator = Intl.Collator("en-US", { sensitivity: "base" });
      const foundBadWords2 = [];
      let found = false;
      wordsList.forEach((word) => {
        found = false;
        found = badWordList.some((bw) => {
          return compareWord(word, bw, collator, fuzzyScoreMin);
        });
        if (found) {
          foundBadWords2.push(word);
        }
      });
      return foundBadWords2;
    }
    let newMessage = message.orig;
    let foundBadWords = [];
    foundBadWords = searchBadWord(words, SETTINGS.chatBadWords, SETTINGS.chatFuzzyScoreForBW);
    if (foundBadWords.length > 0) {
      foundBadWords.forEach((bw) => {
        let newWord = bw.slice(0, 1);
        newWord = newWord.padEnd(bw.length, ".");
        newMessage = newMessage.replaceAll(bw, newWord);
        message.setBody(newMessage);
      });
    }
    foundBadWords = searchBadWord(words, SETTINGS.chatVeryBadWords, SETTINGS.chatFuzzyScoreForVBW);
    if (foundBadWords.length > 0) {
      message.setSpam(true);
      const n = user.username + " " + SETTINGS.chatNoticeToUserVBW;
      UserChatInfo.addPendingNotice(ctx, user.username, n);
    }
  }
};

// src/js/app-module/ModuleTimer.mts
var ModuleTimer = class _ModuleTimer extends ModuleBase {
  liveTimers;
  activeTimers;
  activeCallbacks;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    super(ctx);
    this.liveTimers = {};
    this.activeTimers = {};
    this.activeCallbacks = {};
  }
  static PERSIST_PROPERTIES = ["liveTimers", "activeTimers", "activeCallbacks"];
  static NAMES_IN_SETTINGS = ["A", "B", "C"];
  static CALLBACK_NAME = "timerTemplate";
  static SETTING_BASENAME = "timer";
  static CALLBACK_TEMPLATE = {
    enabled: false,
    func: this.callback,
    defaultDelay: 3600,
    defaultRepeating: false
  };
  static SETTINGS_INFO = {
    length: { defaultValue: 60, fromSettings: true, liveUpdate: false, desc: "timer length in seconds" },
    message: { defaultValue: "Are you READY ?", fromSettings: true, liveUpdate: false, desc: "timer message" },
    repeating: { defaultValue: false, fromSettings: true, liveUpdate: false, desc: "timer is repeating" }
  };
  static callback(ctx) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
    const moduleTimer = _ModuleTimer.getFromKV(ctx);
    moduleTimer._callback(ctx);
    moduleTimer.storeToKV(ctx);
  }
  _callback(ctx) {
    const { callback, user = null, room = null, kv = null, tip = null } = ctx;
    const callbackLabel = callback.label;
    const timerName = getObjectProperty(this.activeCallbacks, callbackLabel, null, false);
    if (timerName) {
      const timerStatus = getObjectProperty(this.activeTimers, timerName, null, false);
      if (timerStatus) {
        printToEveryone(ctx, timerStatus.timerMessage, NOTICE_COLOR_THEME.timer);
        if (timerStatus.repeating) {
          timerStatus.lastStartTime = Date.now();
        } else {
          this.stopTimer(ctx, timerName);
        }
      } else {
        logIt("TIMER: Timer not found: " + timerName);
      }
    } else {
      logIt("TIMER: Callback not found: " + callbackLabel);
    }
  }
  addLiveTimer(ctx, name, length, message = null, repeating = false) {
    const timer = {
      name,
      length,
      message,
      repeating
    };
    this.liveTimers[name] = timer;
    return {
      status: "created" /* created */,
      timerInfo: timer
    };
  }
  deleteLiveTimer(ctx, name) {
    this.stopTimer(ctx, name);
    delete this.liveTimers[name];
    return { status: "deleted" /* deleted */ };
  }
  startTimer(ctx, name) {
    const availlableTimers = this.getAvaillableTimers();
    const timer = getObjectProperty(availlableTimers, name, null, false);
    if (timer) {
      const oldStatus = getObjectProperty(this.activeTimers, name, null, false);
      if (oldStatus && oldStatus.state === "running" /* running */) {
        return oldStatus.state;
      }
      let newStatus = null;
      let callbackLabel = null;
      let length = null;
      let repeating = null;
      let startCallback = false;
      if (oldStatus && oldStatus.state === "frozen" /* frozen */) {
        newStatus = oldStatus;
        callbackLabel = oldStatus.callbackLabel;
        repeating = oldStatus.repeating;
        length = oldStatus.remainingLength;
        oldStatus.timerLength = length;
        startCallback = true;
      } else if (!oldStatus) {
        callbackLabel = this.constructor.CALLBACK_NAME + "__" + name;
        length = timer.length;
        repeating = timer.repeating;
        newStatus = {
          timerName: name,
          timerMessage: timer.message,
          timerLength: length,
          callbackLabel,
          repeating,
          startTime: Date.now(),
          lastStartTime: null,
          state: null
        };
        startCallback = true;
      }
      if (startCallback) {
        newStatus.lastStartTime = Date.now();
        newStatus.state = "running" /* running */;
        const callbacksManager = CallbacksManager.getFromKV(ctx);
        callbacksManager.create(
          ctx,
          callbackLabel,
          length,
          repeating,
          this.constructor.CALLBACK_NAME
        );
        this.activeTimers[name] = newStatus;
        this.activeCallbacks[callbackLabel] = name;
        callbacksManager.storeToKV(ctx);
        return { status: "running" /* running */ };
      }
      return { status: "unknown" /* unknown */ };
    } else {
      return { status: "unknown" /* unknown */ };
    }
  }
  freezeTimer(ctx, name) {
    const timerStatus = getObjectProperty(this.activeTimers, name, null, false);
    if (timerStatus) {
      const callbacksManager = CallbacksManager.getFromKV(ctx);
      callbacksManager.cancel(ctx, timerStatus.callbackLabel);
      delete this.activeCallbacks[timerStatus.callbackLabel];
      timerStatus.state = "frozen" /* frozen */;
      if (timerStatus.repeating) {
        timerStatus.remainingLength = timerStatus.timerLength;
      } else {
        timerStatus.remainingLength = timerStatus.timerLength - Math.round((Date.now() - timerStatus.lastStartTime) / 1e3);
      }
      this.activeTimers[name] = timerStatus;
      callbacksManager.storeToKV(ctx);
      return { status: "frozen" /* frozen */ };
    } else {
      return { status: "unknown" /* unknown */ };
    }
  }
  stopTimer(ctx, name) {
    const timerStatus = getObjectProperty(this.activeTimers, name, null, false);
    if (timerStatus) {
      const callbacksManager = CallbacksManager.getFromKV(ctx);
      callbacksManager.cancel(ctx, timerStatus.callbackLabel);
      delete this.activeCallbacks[timerStatus.callbackLabel];
      delete this.activeTimers[name];
      callbacksManager.storeToKV(ctx);
      return { status: "justStoped" /* justStoped */ };
    } else {
      return { status: "unknown" /* unknown */ };
    }
  }
  stopAllTimer(ctx) {
    const callbacksManager = CallbacksManager.getFromKV(ctx);
    Object.values(this.activeTimers).forEach((timerStatus) => {
      callbacksManager.cancel(ctx, timerStatus.callbackLabel);
      delete this.activeCallbacks[timerStatus.callbackLabel];
      delete this.activeTimers[timerStatus.timerName];
    });
    callbacksManager.storeToKV(ctx);
  }
  getStatus() {
    const availlableTimers = this.getAvaillableTimers();
    Object.entries(availlableTimers).forEach(([tName, tInfo]) => {
      if (Object.hasOwn(this.activeTimers, tName)) {
        const tStatus = this.activeTimers[tName];
        const newInfo = {
          ...tInfo,
          ...tStatus
        };
        availlableTimers[tName] = newInfo;
      }
    });
    return availlableTimers;
  }
  getAvaillableTimers() {
    const staticTimers = this.constructor.getStaticSettings();
    const timers = {
      ...staticTimers,
      ...this.liveTimers
    };
    return timers;
  }
};

// src/js/user-management.mts
var DEFAULT_USER_RIGHTS = {
  guru: 4294967295,
  debug: 2 /* debugShow */ | 4 /* debugChange */,
  owner: 8 /* settingsShow */ | 16 /* settingsSet */ | 32 /* statShow */ | 64 /* timerAdmin */ | 128 /* timerShow */,
  admin: 8 /* settingsShow */ | 16 /* settingsSet */ | 32 /* statShow */ | 64 /* timerAdmin */ | 128 /* timerShow */,
  monitor: 8 /* settingsShow */ | 128 /* timerShow */
};
function getUserCapabilities(userObj) {
  const username = userObj.username;
  let capabilities = 0;
  if (SETTINGS.debugEnableRemoteUser && SETTINGS.debugAllowedUsernames && Array.isArray(SETTINGS.debugAllowedUsernames) && username && SETTINGS.debugAllowedUsernames.includes(username)) {
    capabilities = capabilities | DEFAULT_USER_RIGHTS.debug;
  }
  if (userObj.colorGroup === CB_USER_GROUPS.owner.userColor || userObj.isOwner) {
    capabilities = capabilities | DEFAULT_USER_RIGHTS.owner;
    if (SETTINGS.debugAllowOwner) {
      capabilities = capabilities | DEFAULT_USER_RIGHTS.debug;
    }
  }
  if (SETTINGS.userStaffMembersAdmin && Array.isArray(SETTINGS.userStaffMembersAdmin) && username && SETTINGS.userStaffMembersAdmin.includes(username)) {
    capabilities = capabilities | DEFAULT_USER_RIGHTS.admin;
  }
  if (SETTINGS.userStaffMembersMonitor && Array.isArray(SETTINGS.userStaffMembersMonitor) && username && SETTINGS.userStaffMembersMonitor.includes(username)) {
    capabilities = capabilities | DEFAULT_USER_RIGHTS.monitor;
  }
  return capabilities;
}

// src/js/command/command-debug.mts
var AVAILABLE_STAFF_COMMANDS = [
  {
    name: "debug",
    subCommand: "clearKV",
    capabilities: 4 /* debugChange */,
    func: debugClearKV,
    help: "clearing KV or removing KV entry"
  },
  {
    name: "debug",
    subCommand: "printKV",
    capabilities: 2 /* debugShow */,
    func: debugPrintKV,
    help: "printing some KV content for dev/debug"
  },
  {
    name: "debug",
    subCommand: "sessionClear",
    capabilities: 4 /* debugChange */,
    func: debugSessionClear,
    help: "clear current session data"
  },
  {
    name: "debug",
    subCommand: "sessionInit",
    capabilities: 4 /* debugChange */,
    func: debugSessionInit,
    help: "init a new session"
  },
  {
    name: "debug",
    subCommand: "sessionEnter",
    capabilities: 4 /* debugChange */,
    func: debugSessionEnter,
    help: "Call sessionEnter handler"
  },
  {
    name: "debug",
    subCommand: "sessionLeave",
    capabilities: 4 /* debugChange */,
    func: debugSessionLeave,
    help: "Call sessionLeave handler"
  },
  {
    name: "debug",
    subCommand: "callbackEnable",
    capabilities: 4 /* debugChange */,
    func: debugEnableCallbacks,
    help: "enable default callback"
  },
  {
    name: "debug",
    subCommand: "callbackCancel",
    capabilities: 4 /* debugChange */,
    func: debugCancelCallbacks,
    help: "cancel all callback"
  },
  {
    name: "debug",
    subCommand: "printTips",
    capabilities: 2 /* debugShow */,
    func: debugPrintTips,
    help: "printing user tips info for dev/debug"
  },
  {
    name: "debug",
    subCommand: "clearTips",
    capabilities: 4 /* debugChange */,
    func: debugClearTips,
    help: "clear user tips info"
  },
  {
    name: "debug",
    subCommand: "processTips",
    capabilities: 4 /* debugChange */,
    func: debugProcessTips,
    help: "process user tipsinfo and update stats"
  },
  {
    name: "debug",
    subCommand: "statsClear",
    capabilities: 4 /* debugChange */,
    func: debugClearStats,
    help: "clear Stats"
  },
  {
    name: "debug",
    subCommand: "statsPrint",
    capabilities: 4 /* debugChange */,
    func: debugPrintStats,
    help: "printing Stats"
  }
];
function init() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS);
}
function debugClearKV(ctx, args) {
  const { message = null, user = null, room = null, kv } = ctx;
  if (args && args.length === 1) {
    const key = args[0];
    kv.remove(key);
  } else {
    kv.clear();
  }
}
function debugPrintKV(ctx) {
  const { message = null, user = null, room = null, kv } = ctx;
  let v = null;
  let m = "";
  Object.values(KV_KEYS).forEach((key) => {
    try {
      v = kv.get(key);
      m = key + ": " + JSON.stringify(v, null, "	");
      printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
    } catch (ReferenceError) {
      logIt("unknown key: " + key);
    }
  });
}
function debugSessionInit(ctx) {
  Session.initNewSession(ctx);
}
function debugSessionEnter(ctx) {
  sessionManageEnter(ctx, true);
}
function debugSessionLeave(ctx) {
  sessionManageLeave(ctx);
}
function debugSessionClear(ctx) {
  Session.clear(ctx);
}
function debugEnableCallbacks(ctx) {
  const manager = CallbacksManager.getFromKV(ctx);
  manager.createAllDefaults(ctx);
  manager.storeToKV(ctx);
}
function debugCancelCallbacks(ctx) {
  const manager = CallbacksManager.getFromKV(ctx);
  manager.cancelAll(ctx);
  manager.storeToKV(ctx);
}
function debugPrintTips(ctx) {
  const { message = null, user = null, room = null, kv, tip = null } = ctx;
  const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
  const keyList = Object.keys(keysMap);
  const l = [];
  keyList.forEach((userName) => {
    const userTipInfo = UserTipInfo.getFromKV(ctx, userName);
    l.push(userTipInfo.toString());
  });
  const m = l.join("\n");
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
}
function debugProcessTips(ctx) {
  tipUpdateStatData(ctx);
}
function debugClearTips(ctx) {
  UserTipInfo.clearAll(ctx);
}
function debugClearStats(ctx) {
  const { message = null, user = null, room = null, kv, tip = null } = ctx;
  kv.remove(KV_KEYS.currentGlobalStatsTS);
}
function debugPrintStats(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  const stat = GlobalStatsTimeSeries.getFromKV(ctx);
  logIt("Stats are");
  console.log(stat);
}

// src/js/command/command-help.mts
var LOCAL_AVAILABLE_STAFF_COMMANDS = [
  { name: "help", capabilities: 0, func: cliHelpShowHelp, help: "Need Help ?" }
];
var LOCAL_AVAILABLE_USER_COMMANDS = [
  { name: "help", capabilities: 0, func: cliHelpShowHelp, help: "Need Help ?" }
];
function init2() {
  extendAvaillableStaffCommands(LOCAL_AVAILABLE_STAFF_COMMANDS);
  extendAvaillableUserCommands(LOCAL_AVAILABLE_USER_COMMANDS);
}
function cliHelpShowHelp(ctx) {
  const { user, room = null, kv = null } = ctx;
  const userCap = getUserCapabilities(user);
  function loopOnAvailableCommands(availableCommands, baseCmd) {
    let message2 = "";
    availableCommands.forEach((c) => {
      if ((c.capabilities & userCap) === c.capabilities) {
        if (c.subCommand === void 0) {
          message2 = `${message2} ${baseCmd} ${c.name} 	 -> ${c.help} 
`;
        } else {
          message2 = `${message2} ${baseCmd} ${c.name} ${c.subCommand} 	 -> ${c.help} 
`;
        }
      }
    });
    return message2;
  }
  let message = "Here the commands availlable to you:\n";
  message = message + loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS2, SETTINGS.cliBaseStaffCommand);
  message = message + loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, SETTINGS.cliBaseUserCommand);
  printCommandResult(ctx, message, NOTICE_COLOR_THEME.help);
}

// src/js/command/command-setting.mts
var AVAILABLE_STAFF_COMMANDS3 = [
  {
    name: "settings",
    subCommand: "show",
    capabilities: 8 /* settingsShow */,
    func: cliSettingShowSettings,
    help: "showing current settings"
  },
  {
    name: "settings",
    subCommand: "showlive",
    capabilities: 8 /* settingsShow */,
    func: cliSettingShowLiveSettings,
    help: "showing overriding settings, stored in KV"
  },
  {
    name: "settings",
    subCommand: "setlive",
    capabilities: 16 /* settingsSet */,
    func: cliSettingSetLiveSetting,
    help: "override a setting"
  },
  {
    name: "settings",
    subCommand: "clearlive",
    capabilities: 16 /* settingsSet */,
    func: cliSettingClearLiveSetting,
    help: "clear an overrided setting"
  },
  {
    name: "settings",
    subCommand: "clearliveall",
    capabilities: 16 /* settingsSet */,
    func: cliSettingClearAllLiveSettings,
    help: "clear all overrided settings"
  }
];
function init3() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS3);
}
function cliSettingShowSettings(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  printCommandResult(ctx, JSON.stringify(SETTINGS, null, "	"), NOTICE_COLOR_THEME.staff);
}
function cliSettingSetLiveSetting(ctx, args) {
  const { message = null, user = null, room = null, kv } = ctx;
  if (args.length > 1) {
    const key = args[0];
    const v = args[1];
    if (Object.hasOwn(SETTINGS_INFO, key)) {
      const sInfo = SETTINGS_INFO[key];
      const { defaultValue = null, liveUpdate = null, convert = null } = sInfo;
      if (liveUpdate) {
        let settings = {};
        settings = kv.get(KV_KEYS.liveSettings, {});
        if (convert && v) {
          let c = null;
          let l = null;
          let nv = null;
          switch (convert) {
            case SETTINGS_CONVERT.number:
              c = parseInt(v);
              if (typeof c === "number" && c) {
                settings[key] = c;
              } else {
                settings[key] = defaultValue;
              }
              break;
            case SETTINGS_CONVERT.listString:
              l = v.split(CB_SETTINGS_LIST_SEPARATOR);
              nv = [];
              l.forEach((u) => {
                nv.push(u.trim());
              });
              settings[key] = nv;
              break;
            case SETTINGS_CONVERT.boolean:
              c = parseInt(v);
              if (v === "true") {
                settings[key] = true;
              } else if (v === "false") {
                settings[key] = false;
              } else {
                settings[key] = defaultValue;
              }
              break;
            default:
              settings[key] = v;
              break;
          }
        } else {
          settings[key] = v;
        }
        kv.set(KV_KEYS.liveSettings, settings);
      }
    }
  }
}
function cliSettingClearLiveSetting(ctx, args) {
  const { message = null, user = null, room = null, kv } = ctx;
  if (args.length === 1) {
    const key = args[0];
    if (Object.hasOwn(SETTINGS_INFO, key)) {
      const sInfo = SETTINGS_INFO[key];
      const { liveUpdate = null } = sInfo;
      if (liveUpdate) {
        let settings = {};
        settings = kv.get(KV_KEYS.liveSettings, {});
        delete settings[key];
        kv.set(KV_KEYS.liveSettings, settings);
      }
    }
  }
}
function cliSettingClearAllLiveSettings(ctx) {
  const { message = null, user = null, room = null, kv } = ctx;
  const settings = {};
  kv.set(KV_KEYS.liveSettings, settings);
}
function cliSettingShowLiveSettings(ctx) {
  const { message = null, user = null, room = null, kv } = ctx;
  const settings = kv.get(KV_KEYS.liveSettings, {});
  printCommandResult(ctx, JSON.stringify(settings, null, "	"), NOTICE_COLOR_THEME.staff);
}

// src/js/app-module/GlobalStatsCompute.mts
var GlobalStatsCompute = class {
  sessionID;
  globalStatsTS;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.globalStatsTS = GlobalStatsTimeSeries.getFromKV(ctx);
  }
  static TIME_RANGE = {
    ALL: 0,
    min5: 5 * 60 * 1e3,
    min15: 15 * 60 * 1e3
  };
  getTipSum(tsType, tsName, period) {
    const list = this.globalStatsTS.getTimeSerie(tsType, tsName);
    const span = this.globalStatsTS.getTimeSerieSpan(tsType, tsName);
    const currentDate = Date.now();
    const refDate = this.globalStatsTS.getTimeSerieMetadata(
      tsType,
      tsName,
      "refDate" /* refDate */,
      0
    );
    let sum = 0;
    if (refDate <= currentDate) {
      this.globalStatsTS.slideAllTimeSeries(currentDate, tsType);
    }
    if (period >= span) {
      const idxStart = Math.floor((refDate - currentDate) / span);
      const idxEnd = idxStart + Math.floor(period / span);
      for (let index = idxStart; index < idxEnd; index++) {
        sum = sum + list[index];
      }
    }
    return sum;
  }
  getMaxTipper(period) {
    const tsType = "userTips" /* userTips */;
    const userNames = this.globalStatsTS.getTimeSerieNames(tsType);
    let max = 0;
    let uName = null;
    userNames.forEach((tsName) => {
      const sum = this.getTipSum(tsType, tsName, period);
      if (sum > max) {
        max = sum;
        uName = tsName;
      }
    });
    return { userName: uName, tokens: max };
  }
  getTotalTips(period, minTipsToAccount = 0) {
    const tsType = "userTips" /* userTips */;
    const userNames = this.globalStatsTS.getTimeSerieNames(tsType);
    let total = 0;
    let userCount = 0;
    userNames.forEach((tsName) => {
      const sum = this.getTipSum(tsType, tsName, period);
      if (sum > minTipsToAccount) {
        total = total + sum;
        userCount = userCount + 1;
      }
    });
    return { tokens: total, userCount };
  }
  getSessionTotalTips(ctx) {
    const tsType = "userTips" /* userTips */;
    const userNames = this.globalStatsTS.getTimeSerieNames(tsType);
    let total = 0;
    let userCount = 0;
    userNames.forEach((tsName) => {
      const tipInfo = UserTipInfo.getFromKV(ctx, tsName);
      if (tipInfo.tipTotal > 0) {
        total = total + tipInfo.tipTotal;
        userCount = userCount + 1;
      }
    });
    return { tokens: total, userCount };
  }
};

// src/js/command/command-stat.mts
var AVAILABLE_STAFF_COMMANDS4 = [
  {
    name: "stat",
    subCommand: "showTips",
    capabilities: 32 /* statShow */,
    func: cliStatShowTipStats,
    help: "show Stats about tips"
  }
];
function init4() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS4);
}
function cliStatShowTipStats(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  const statCompute = new GlobalStatsCompute(ctx);
  const p5min = 5 * 60 * 1e3;
  const bt5min = statCompute.getMaxTipper(p5min);
  const tot5min0tk = statCompute.getTotalTips(p5min, 0);
  const tot5min5tk = statCompute.getTotalTips(p5min, 5);
  const totSession = statCompute.getSessionTotalTips(ctx);
  const msg = `Some Stats:
    - Best Tipper in last 5 minutes: ${bt5min.userName} (${bt5min.tokens} tokens)
    - Total Tips  in last 5 minutes:     ${tot5min0tk.tokens} (${tot5min0tk.userCount} users)
    - Total Big Tips  in last 5 minutes: ${tot5min5tk.tokens} (${tot5min5tk.userCount} users)
    - Total Tips in current Session: ${totSession.tokens} (${totSession.userCount} users)`;
  printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
}

// src/js/command/command-test.mts
var AVAILABLE_STAFF_COMMANDS5 = [
  {
    name: "test",
    subCommand: "perfkv",
    capabilities: 4 /* debugChange */,
    func: testPerfKV,
    help: "some KV perf testing"
  },
  {
    name: "test",
    subCommand: "getID",
    capabilities: 4 /* debugChange */,
    func: testRandomID,
    help: "testing ID generation"
  }
  // { name: 'test', subCommand: 'testExtend', capabilities: CAPABILITY.debugChange, 
  // func: testExtendClass, help: 'test JS extend classes' },
];
var AVAILABLE_USER_COMMANDS2 = [
  { name: "debug", subCommand: "test", capabilities: 0, func: testDebugCommand, help: "some testing" }
];
function init5() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS5);
  extendAvaillableUserCommands(AVAILABLE_USER_COMMANDS2);
}
function testRandomID(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  let m = getRandomID();
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
  m = getRandomID(4);
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
  m = getRandomID(8);
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
}
function testDebugCommand(ctx) {
  printCommandResult(ctx, "Good you can run a command", NOTICE_COLOR_THEME.help);
}
function testPerfKV(ctx) {
  const { message, user = null, room = null, kv } = ctx;
  logIt("testing KV perf");
  const origBody = message.orig.trim().toLowerCase();
  const elements = origBody.split(" ");
  const action = elements[3];
  if ("init" === action) {
    const toto = { tete: 0, l: [] };
    kv.set("toto", toto);
  } else if ("display" === action) {
    const t = kv.get("toto", {});
    logIt(t.tete);
    let s = 0;
    t.l.forEach((e) => {
      s = s + e;
    });
    logIt(s);
  } else {
    const iter = parseInt(action);
    let t = {};
    t = kv.get("toto", {});
    for (let index = 0; index < iter; index++) {
      t = kv.get("toto", {});
      t.tete = t.tete + 1;
      t.l.push(t.tete);
      kv.set("toto", t);
    }
  }
}

// src/js/command/command-timer.mts
var AVAILABLE_STAFF_COMMANDS6 = [
  {
    name: "timer",
    subCommand: "start",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerStart,
    help: "Start timer"
  },
  {
    name: "timer",
    subCommand: "stop",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerStop,
    help: "Stop timer"
  },
  {
    name: "timer",
    subCommand: "stopall",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerStopAll,
    help: "Stop All timers"
  },
  {
    name: "timer",
    subCommand: "freeze",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerFreeze,
    help: "Freeze timer"
  },
  {
    name: "timer",
    subCommand: "list",
    capabilities: 128 /* timerShow */,
    func: cliTimerListTimers,
    help: "List timers"
  },
  {
    name: "timer",
    subCommand: "add",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerAddTimer,
    help: "Add a timer"
  },
  {
    name: "timer",
    subCommand: "delete",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerdeleteTimer,
    help: "delete a timer"
  }
];
function init6() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS6);
}
function cliTimerStart(ctx, args, cliInfo) {
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTimer.startTimer(ctx, name);
    if (result.status === "running" /* running */) {
      moduleTimer.storeToKV(ctx);
      console.log(moduleTimer);
      printCommandResult(ctx, "Timer started: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === "unknown" /* unknown */) {
      printCommandResult(ctx, "Timer unknown: " + name, NOTICE_COLOR_THEME.error);
    } else {
      printCommandResult(ctx, "Timer, unknown error: " + name, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${SETTINGS.cliBaseStaffCommand} ${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerFreeze(ctx, args, cliInfo) {
  if (args.length === 1) {
    const moduleTImer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTImer.freezeTimer(ctx, name);
    if (result.status === "frozen" /* frozen */) {
      moduleTImer.storeToKV(ctx);
      printCommandResult(ctx, "Timer frozen: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === "unknown" /* unknown */) {
      printCommandResult(ctx, "Timer unknown: " + name, NOTICE_COLOR_THEME.error);
    } else {
      printCommandResult(ctx, "Timer, unknown error: " + name, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerStop(ctx, args, cliInfo) {
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTimer.stopTimer(ctx, name);
    if (result.status === "justStoped" /* justStoped */) {
      moduleTimer.storeToKV(ctx);
      printCommandResult(ctx, "Timer stoped: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === "unknown" /* unknown */) {
      printCommandResult(ctx, "Timer unknown: " + name, NOTICE_COLOR_THEME.error);
    } else {
      printCommandResult(ctx, "Timer, unknown error: " + name, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerStopAll(ctx) {
  const moduleTImer = ModuleTimer.getFromKV(ctx);
  moduleTImer.stopAllTimer(ctx);
  moduleTImer.storeToKV(ctx);
  cliTimerListTimers(ctx);
}
function cliTimerAddTimer(ctx, args, cliInfo) {
  if (args.length >= 2) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const timerLength = parseInt(args[0]);
    const timerMessage = args.slice(1).join(" ");
    const existingNames = Object.keys(moduleTimer.getAvaillableTimers());
    let timerName = null;
    AVAILLABLE_LIVE_SETTINGS_NAMES.some((pName) => {
      if (!existingNames.includes(pName)) {
        timerName = pName;
        return true;
      }
    });
    if (timerName && timerLength) {
      const result = moduleTimer.addLiveTimer(ctx, timerName, timerLength, timerMessage, false);
      moduleTimer.storeToKV(ctx);
      const msg = `OK: timer ${result.timerInfo.name} created`;
      printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
    } else {
      let msg = "";
      if (!timerLength) {
        msg = msg + "ERROR: length not correct: " + args[0] + " \n";
      }
      if (!timerName) {
        msg = msg + "ERROR: No free timer name\n";
      }
      msg = msg + `${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <length in sec> <message>`;
      printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please enter timer infos
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <length in sec> <message>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerdeleteTimer(ctx, args, cliInfo) {
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const existingNames = Object.keys(moduleTimer.liveTimers);
    if (existingNames.includes(name)) {
      const result = moduleTimer.deleteLiveTimer(ctx, name);
      if (result.status === "deleted" /* deleted */) {
        moduleTimer.storeToKV(ctx);
        printCommandResult(ctx, "Timer deleted: " + name, NOTICE_COLOR_THEME.staff);
      }
    } else {
      printCommandResult(ctx, "Timer not found or Static Timer: " + name, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerListTimers(ctx) {
  const moduleTimer = ModuleTimer.getFromKV(ctx);
  const timers = moduleTimer.getStatus();
  let msg = `Timers list:`;
  let m = "";
  console.log(timers);
  Object.entries(timers).forEach(([tName, tInfo]) => {
    if (typeof tInfo.state === "undefined") {
      m = `${tName}: ${tInfo.length}sec '${tInfo.message}'`;
    } else if (tInfo.state === "running" /* running */) {
      m = `${tName}: ${tInfo.length}sec ${tInfo.state} ${tInfo.timerLength - Math.round((Date.now() - tInfo.lastStartTime) / 1e3)}sec rem '${tInfo.message}'`;
    } else if (tInfo.state === "frozen" /* frozen */) {
      m = `${tName}: ${tInfo.length}sec ${tInfo.state} ${tInfo.remainingLength}sec remaining '${tInfo.message}'`;
    }
    msg = `${msg}
        ${m}`;
  });
  printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
}

// src/js/command/command-processor.mts
function createCommandsList() {
  init5();
  init();
  init3();
  init4();
  init6();
  init2();
}
var AVAILABLE_STAFF_COMMANDS2 = [];
var AVAILABLE_USER_COMMANDS = [];
function extendAvaillableStaffCommands(commandList) {
  commandList.forEach((command) => {
    AVAILABLE_STAFF_COMMANDS2.push(command);
  });
}
function extendAvaillableUserCommands(commandList) {
  commandList.forEach((command) => {
    AVAILABLE_USER_COMMANDS.push(command);
  });
}
function commandProcessor(ctx) {
  const { message, user, room = null, kv = null } = ctx;
  const userCap = getUserCapabilities(user);
  function loopOnAvailableCommands(availableCommands, origBody2) {
    const elements = origBody2.split(" ");
    const commandName = elements[1];
    const subCommand = elements[2];
    let cmdFound = false;
    availableCommands.forEach((c) => {
      if (c.name === commandName && (c.capabilities & userCap) === c.capabilities) {
        if (c.subCommand === void 0 || c.subCommand === subCommand) {
          let args = [];
          const cliInfo = {
            commandName,
            subCommand: null
          };
          if (c.subCommand === void 0) {
            args = elements.slice(2);
          } else {
            args = elements.slice(3);
            cliInfo.subCommand = c.subCommand;
          }
          cmdFound = true;
          c.func(ctx, args, cliInfo);
        }
      }
    });
    if (!cmdFound) {
      printCommandResult(ctx, "Command not found !", NOTICE_COLOR_THEME.error);
    }
  }
  const origBody = message.orig.trim();
  if (origBody[0] === COMMAND_START_CHAR) {
    createCommandsList();
    if (origBody.startsWith(SETTINGS.cliBaseStaffCommand)) {
      loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS2, origBody);
    } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand)) {
      loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, origBody);
    }
  }
}

// src/js/shared_code.mts
function onTipReceived(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  UserTipInfo.updateUserTips(ctx);
}
function onMessage(ctx) {
  const { message, user = null, room = null, kv = null } = ctx;
  const origBody = message.orig.trim();
  if (origBody[0] === COMMAND_START_CHAR) {
    commandProcessor(ctx);
  }
  const chatFilter = ModuleChatFilter.getFromKV(ctx);
  chatFilter.onMessage(ctx);
  chatFilter.storeToKV(ctx);
}
function onMessageTransform(ctx) {
  const { message, user = null, room = null, kv = null } = ctx;
  const origBody = message.orig.trim();
  if (origBody[0] === COMMAND_START_CHAR) {
    if (origBody.startsWith(SETTINGS.cliBaseStaffCommand) && !SETTINGS.cliBroadcastStaffCmd) {
      message.setSpam(true);
    } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand) && !SETTINGS.cliBroadcastUserCmd) {
      message.setSpam(true);
    }
  } else {
    const chatFilter = ModuleChatFilter.getFromKV(ctx);
    chatFilter.onMessageTransform(ctx);
    chatFilter.storeToKV(ctx);
  }
}
function onAppStart(ctx) {
  const { app, user = null, room = null, kv, tip = null } = ctx;
  const sObj = kv.get(KV_KEYS.currentSession, null);
  if (!sObj) {
    sessionManageEnter(ctx);
  }
  const m = `\u26A1\uFE0F ${app.name} (v${app.version}) has started.`;
  printToOwner(ctx, m, NOTICE_COLOR_THEME.staff);
  const manager = CallbacksManager.initNewManager(ctx);
  manager.createAllDefaults(ctx);
  manager.storeToKV(ctx);
  logIt("App started");
}
function onAppStop(ctx) {
  const { app, user = null, room = null, kv = null, tip = null } = ctx;
  const m = `\u26A1\uFE0F ${app.name} has stopped`;
  printToOwner(ctx, m, NOTICE_COLOR_THEME.staff);
  logIt("App stoped");
}
function onBroadcastStart(ctx) {
  sessionManageEnter(ctx);
  logIt("Broadcast started YOOOUUUUPPPIIIII");
}
function onBroadcastStop(ctx) {
  sessionManageLeave(ctx);
  logIt("Broadcast stoped,  gniininii");
}
function onUserEnter(ctx) {
  const { message = null, user, room = null, kv = null, tip = null } = ctx;
  if (user.isOwner || user.colorGroup === CB_USER_GROUPS.owner.userColor) {
    sessionManageEnter(ctx);
  }
}
function onUserLeave(ctx) {
  const { message = null, user, room = null, kv = null, tip = null } = ctx;
  if (user.isOwner || user.colorGroup === CB_USER_GROUPS.owner.userColor) {
    sessionManageLeave(ctx);
  }
}
function onCallback(ctx) {
  const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
  const manager = CallbacksManager.getFromKV(ctx);
  manager.onEvent(ctx);
}
function bundlerHack() {
  const CBentryPoints = [
    onAppStart,
    onAppStop,
    onBroadcastStart,
    onBroadcastStop,
    onCallback,
    onMessage,
    onMessageTransform,
    onTipReceived,
    onUserEnter,
    onUserLeave
  ];
}
bundlerHack();
ModuleTimer.extendSettings();
ModuleTimer.extendCallback();
updateSettings();

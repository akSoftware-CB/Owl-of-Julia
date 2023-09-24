// src/js/cli/cli-print.mjs
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
  const { user = null, room = null, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: user.username
  };
  room.sendNotice(message, p);
}

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

// src/js/command/command-test.mjs
function testRandomID(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  let m = getRandomID();
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
  m = getRandomID(4);
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
  m = getRandomID(8);
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
}

// src/js/defaults.mts
var COMMAND_START_CHAR = "!";
var BASE_STAFF_COMMAND = "!zeus";
var BASE_USER_COMMAND = "!jarvis";
var CB_SETTINGS_LIST_SEPARATOR = ",";

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
  sessionHistoryMaxLenght: {
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
var SETTINGS = SETTINGS_INFO;
updateSettings();

// src/js/shared_code.mjs
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
var CAPABILITY = {
  none: 0,
  debugShow: 2,
  debugChange: 4,
  settingsShow: 8,
  settingsSet: 16,
  statShow: 32,
  timerAdmin: 64,
  timerShow: 128
};
var DEFAULT_USER_RIGHTS = {
  guru: 4294967295,
  debug: CAPABILITY.debugShow | CAPABILITY.debugChange,
  owner: CAPABILITY.settingsShow | CAPABILITY.settingsSet | CAPABILITY.statShow | CAPABILITY.timerAdmin | CAPABILITY.timerShow,
  admin: CAPABILITY.settingsShow | CAPABILITY.settingsSet | CAPABILITY.statShow | CAPABILITY.timerAdmin | CAPABILITY.timerShow,
  monitor: CAPABILITY.settingsShow | CAPABILITY.timerShow
};
var AVAILABLE_STAFF_COMMANDS = [
  { name: "debug", subCommand: "perfkv", capabilities: CAPABILITY.guru, func: testPerfKV, help: "some KV perf testing" },
  {
    name: "debug",
    subCommand: "clearKV",
    capabilities: CAPABILITY.debugChange,
    func: debugClearKV,
    help: "clearing KV or removing KV entry"
  },
  {
    name: "debug",
    subCommand: "printKV",
    capabilities: CAPABILITY.debugShow,
    func: debugPrintKV,
    help: "printing some KV content for dev/debug"
  },
  {
    name: "debug",
    subCommand: "sessionClear",
    capabilities: CAPABILITY.debugChange,
    func: debugSessionClear,
    help: "clear current session data"
  },
  {
    name: "debug",
    subCommand: "sessionInit",
    capabilities: CAPABILITY.debugChange,
    func: debugSessionInit,
    help: "init a new session"
  },
  {
    name: "debug",
    subCommand: "sessionCreate",
    capabilities: CAPABILITY.debugChange,
    func: debugSessionCreate,
    help: "Force create a new session"
  },
  {
    name: "debug",
    subCommand: "printTips",
    capabilities: CAPABILITY.debugShow,
    func: debugPrintTips,
    help: "printing user tips info for dev/debug"
  },
  {
    name: "debug",
    subCommand: "clearTips",
    capabilities: CAPABILITY.debugChange,
    func: debugClearTips,
    help: "clear user tips info"
  },
  {
    name: "debug",
    subCommand: "processTips",
    capabilities: CAPABILITY.debugChange,
    func: debugProcessTips,
    help: "process user tipsinfo and update stats"
  },
  {
    name: "debug",
    subCommand: "statsClear",
    capabilities: CAPABILITY.debugChange,
    func: debugClearStats,
    help: "clear Stats"
  },
  {
    name: "debug",
    subCommand: "statsPrint",
    capabilities: CAPABILITY.debugChange,
    func: debugPrintStats,
    help: "printing Stats"
  },
  {
    name: "debug",
    subCommand: "callbackEnable",
    capabilities: CAPABILITY.debugChange,
    func: debugEnableCallbacks,
    help: "enable default callback"
  },
  {
    name: "debug",
    subCommand: "callbackCancel",
    capabilities: CAPABILITY.debugChange,
    func: debugCancelCallbacks,
    help: "cancel all callback"
  },
  {
    name: "test",
    subCommand: "sessionEnter",
    capabilities: CAPABILITY.debugChange,
    func: sessionManageEnter,
    help: "testing session management"
  },
  {
    name: "test",
    subCommand: "sessionLeave",
    capabilities: CAPABILITY.debugChange,
    func: sessionManageLeave,
    help: "testing session management"
  },
  {
    name: "test",
    subCommand: "getID",
    capabilities: CAPABILITY.debugChange,
    func: testRandomID,
    help: "testing ID generation"
  },
  {
    name: "test",
    subCommand: "statInit",
    capabilities: CAPABILITY.debugChange,
    func: debugGlobalStatInit,
    help: "init new stat"
  },
  {
    name: "test",
    subCommand: "testExtend",
    capabilities: CAPABILITY.debugChange,
    func: testExtendClass,
    help: "test JS extend classes"
  },
  { name: "help", capabilities: 0, func: cliHelpShowHelp, help: "some testing" },
  {
    name: "settings",
    subCommand: "show",
    capabilities: CAPABILITY.settingsShow,
    func: cliSettingShowSettings,
    help: "showing current settings"
  },
  {
    name: "settings",
    subCommand: "showlive",
    capabilities: CAPABILITY.settingsShow,
    func: cliSettingShowLiveSettings,
    help: "showing overriding settings, stored in KV"
  },
  {
    name: "settings",
    subCommand: "setlive",
    capabilities: CAPABILITY.settingsSet,
    func: cliSettingSetLiveSetting,
    help: "override a setting"
  },
  {
    name: "settings",
    subCommand: "clearlive",
    capabilities: CAPABILITY.settingsSet,
    func: cliSettingClearLiveSetting,
    help: "clear an overrided setting"
  },
  {
    name: "settings",
    subCommand: "clearliveall",
    capabilities: CAPABILITY.settingsSet,
    func: cliSettingClearAllLiveSettings,
    help: "clear all overrided settings"
  },
  {
    name: "stat",
    subCommand: "showTips",
    capabilities: CAPABILITY.statShow,
    func: cliStatShowTipStats,
    help: "show Stats about tips"
  },
  {
    name: "timer",
    subCommand: "start",
    capabilities: CAPABILITY.timerAdmin,
    func: cliTimerStart,
    help: "Start timer"
  },
  {
    name: "timer",
    subCommand: "stop",
    capabilities: CAPABILITY.timerAdmin,
    func: cliTimerStop,
    help: "Stop timer"
  },
  {
    name: "timer",
    subCommand: "stopall",
    capabilities: CAPABILITY.timerAdmin,
    func: cliTimerStopAll,
    help: "Stop All timers"
  },
  {
    name: "timer",
    subCommand: "freeze",
    capabilities: CAPABILITY.timerAdmin,
    func: cliTimerFreeze,
    help: "Freeze timer"
  },
  {
    name: "timer",
    subCommand: "list",
    capabilities: CAPABILITY.timerShow,
    func: cliTimerListTimers,
    help: "List timers"
  },
  {
    name: "timer",
    subCommand: "add",
    capabilities: CAPABILITY.timerAdmin,
    func: cliTimerAddTimer,
    help: "Add a timer"
  },
  {
    name: "timer",
    subCommand: "delete",
    capabilities: CAPABILITY.timerAdmin,
    func: cliTimerdeleteTimer,
    help: "delete a timer"
  }
];
var AVAILABLE_USER_COMMANDS = [
  { name: "debug", subCommand: "test", capabilities: 0, func: testDebugCommand, help: "some testing" },
  { name: "help", capabilities: 0, func: cliHelpShowHelp, help: "some testing" }
];
var CALLBACKS_INFO = {
  tipUpdateStatData: {
    enabled: true,
    func: tipUpdateStatData,
    defaultDelay: 5,
    defaultRepeating: true
  }
};
function cliSettingShowSettings(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  printCommandResult(ctx, JSON.stringify(SETTINGS, null, "	"), NOTICE_COLOR_THEME.staff);
}
function cliHelpShowHelp(ctx) {
  const { user = null, room = null, kv = null } = ctx;
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
  message = message + loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS, SETTINGS.cliBaseStaffCommand);
  message = message + loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, SETTINGS.cliBaseUserCommand);
  printCommandResult(ctx, message, NOTICE_COLOR_THEME.help);
}
function cliSettingSetLiveSetting(ctx, args) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  if (args.length > 1) {
    const key = args[0];
    const v = args[1];
    if (Object.hasOwn(SETTINGS_INFO, key)) {
      const sInfo = SETTINGS_INFO[key];
      const {
        defaultValue = null,
        desc = null,
        fromSettings = null,
        forceUpdate = null,
        liveUpdate = null,
        convert = null
      } = sInfo;
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
  const { message = null, user = null, room = null, kv = null } = ctx;
  if (args.length === 1) {
    const key = args[0];
    if (Object.hasOwn(SETTINGS_INFO, key)) {
      const sInfo = SETTINGS_INFO[key];
      const {
        defaultValue = null,
        desc = null,
        fromSettings = null,
        forceUpdate = null,
        liveUpdate = null,
        convert = null
      } = sInfo;
      if (liveUpdate) {
        let settings = {};
        settings = kv.get(KV_KEYS.liveSettings, {});
        delete settings[key];
        kv.set(KV_KEYS.liveSettings, settings);
      }
    }
  }
}
function cliSettingClearAllLiveSettings(ctx, args) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  const settings = {};
  kv.set(KV_KEYS.liveSettings, settings);
}
function cliSettingShowLiveSettings(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  const settings = kv.get(KV_KEYS.liveSettings, {});
  printCommandResult(ctx, JSON.stringify(settings, null, "	"), NOTICE_COLOR_THEME.staff);
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
function cliTimerStart(ctx, args, cliInfo) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTimer.startTimer(ctx, name);
    if (result.status === ModuleTimer.TIMER_STATUS.running) {
      moduleTimer.storeToKV(ctx);
      console.log(moduleTimer);
      printCommandResult(ctx, "Timer started: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === ModuleTimer.TIMER_STATUS.unknown) {
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
  const { message = null, user = null, room = null, kv = null } = ctx;
  if (args.length === 1) {
    const moduleTImer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTImer.freezeTimer(ctx, name);
    if (result.status === ModuleTimer.TIMER_STATUS.frozen) {
      moduleTImer.storeToKV(ctx);
      printCommandResult(ctx, "Timer frozen: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === ModuleTimer.TIMER_STATUS.unknown) {
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
  const { message = null, user = null, room = null, kv = null } = ctx;
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTimer.stopTimer(ctx, name);
    if (result.status === ModuleTimer.TIMER_STATUS.justStoped) {
      moduleTimer.storeToKV(ctx);
      printCommandResult(ctx, "Timer stoped: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === ModuleTimer.TIMER_STATUS.unknown) {
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
function cliTimerStopAll(ctx, args, cliInfo) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  const moduleTImer = ModuleTimer.getFromKV(ctx);
  moduleTImer.stopAllTimer(ctx);
  moduleTImer.storeToKV(ctx);
  cliTimerListTimers(ctx);
}
function cliTimerAddTimer(ctx, args, cliInfo) {
  const { message = null, user = null, room = null, kv = null } = ctx;
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
  const { message = null, user = null, room = null, kv = null } = ctx;
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const existingNames = Object.keys(moduleTimer.liveTimers);
    if (existingNames.includes(name)) {
      const result = moduleTimer.deleteLiveTimer(ctx, name);
      if (result.status === ModuleTimer.TIMER_STATUS.deleted) {
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
  const { message = null, user = null, room = null, kv = null } = ctx;
  const moduleTimer = ModuleTimer.getFromKV(ctx);
  const timers = moduleTimer.getStatus(ctx);
  let msg = `Timers list:`;
  let m = "";
  console.log(timers);
  Object.entries(timers).forEach(([tName, tInfo]) => {
    if (typeof tInfo.state === "undefined") {
      m = `${tName}: ${tInfo.length}sec '${tInfo.message}'`;
    } else if (tInfo.state === ModuleTimer.TIMER_STATUS.running) {
      m = `${tName}: ${tInfo.length}sec ${tInfo.state} ${tInfo.timerLength - Math.round((Date.now() - tInfo.lastStartTime) / 1e3)}sec rem '${tInfo.message}'`;
    } else if (tInfo.state === ModuleTimer.TIMER_STATUS.frozen) {
      m = `${tName}: ${tInfo.length}sec ${tInfo.state} ${tInfo.remainingLength}sec remaining '${tInfo.message}'`;
    }
    msg = `${msg}
        ${m}`;
  });
  printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
}
function printToOwner(ctx, message, theme = NOTICE_COLOR_THEME.staff) {
  const { user = null, room = null, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: room.owner
  };
  room.sendNotice(message, p);
}
function printToUser(ctx, message, username, theme = NOTICE_COLOR_THEME.userError) {
  const { user = null, room = null, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: username
  };
  room.sendNotice(message, p);
}
function printToEveryone(ctx, message, theme = NOTICE_COLOR_THEME.user) {
  const { user = null, room = null, kv = null } = ctx;
  const p = {
    ...theme
  };
  room.sendNotice(message, p);
}
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
function sessionManageEnter(ctx, force = false) {
  const { user = null, room = null, kv = null } = ctx;
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
  const { user = null, room = null, kv = null } = ctx;
  const currentDate = Date.now();
  kv.set(KV_KEYS.sessionLastLeaveDate, currentDate);
}
var Session = class _Session {
  constructor(currentDate) {
    this.sessionID = getRandomID(8);
    this.startDate = currentDate;
  }
  static initNewSession(ctx, currentDate = null, first = false) {
    const { user = null, room = null, kv = null } = ctx;
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
      let tl = kv.get(KV_KEYS.sessionHistory, []);
      const count = tl.unshift(newSession);
      if (count > SETTINGS.sessionHistoryMaxLenght) {
        tl.pop();
      }
      kv.set(KV_KEYS.sessionHistory, tl);
    }
    printToOwner(ctx, "New Session created :-)");
  }
  static clear(ctx) {
    const { user = null, room = null, kv = null } = ctx;
    kv.remove(KV_KEYS.sessionStartDate);
    kv.remove(KV_KEYS.sessionLastEnterDate);
    kv.remove(KV_KEYS.sessionLastLeaveDate);
    kv.remove(KV_KEYS.currentSession);
  }
};
var UserTipInfo = class _UserTipInfo {
  constructor(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    this.tipList = [];
    this.tipTotal = 0;
    this.userName = userName;
    const sObj = kv.get(KV_KEYS.currentSession);
    this.sessionID = sObj.sessionID;
    this.key = _UserTipInfo.getUserTipKey(ctx, userName);
  }
  static getFromKV(ctx, userName) {
    let userTipInfo = new _UserTipInfo(ctx, userName);
    userTipInfo.loadFromKV(ctx);
    return userTipInfo;
  }
  static getUserTipKey(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let key = null;
    let keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
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
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const userName = user.username;
    let userTipInfo = _UserTipInfo.getFromKV(ctx, userName);
    userTipInfo.addTip(ctx);
    userTipInfo.storeToKV(ctx);
  }
  static clearAll(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
    const keyList = Object.values(keysMap);
    keyList.forEach((key) => {
      kv.remove(key);
    });
    kv.remove(KV_KEYS.userTipsKeysMap);
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let userTipInfo = kv.get(this.key, null);
    if (userTipInfo) {
      this.tipList = userTipInfo.tipList;
      this.tipTotal = userTipInfo.tipTotal;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    kv.set(this.key, this);
  }
  addTip(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
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
var UserChatInfo = class _UserChatInfo {
  constructor(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    this.userName = userName;
    const sObj = kv.get(KV_KEYS.currentSession);
    this.sessionID = sObj.sessionID;
    this.key = _UserChatInfo.getUserChatKey(ctx, userName);
    this.pendingNotices = [];
  }
  static getFromKV(ctx, userName) {
    let userChatInfo = new _UserChatInfo(ctx, userName);
    userChatInfo.loadFromKV(ctx);
    return userChatInfo;
  }
  static getUserChatKey(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let key = null;
    let keysMap = kv.get(KV_KEYS.userChatKeysMap, {});
    if (Object.hasOwn(keysMap, userName)) {
      key = keysMap[userName];
    } else {
      key = userName + "-" + getRandomID(4);
      keysMap[userName] = key;
      kv.set(KV_KEYS.userChatKeysMap, keysMap);
    }
    return key;
  }
  static addPendingNotice(ctx, userName, futureNotice) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let userChatInfo = _UserChatInfo.getFromKV(ctx, userName);
    userChatInfo.addNotice(ctx, futureNotice);
    userChatInfo.storeToKV(ctx);
  }
  static sendPendingNotices(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let userChatInfo = _UserChatInfo.getFromKV(ctx, userName);
    let notice = "";
    while (typeof (notice = userChatInfo.pendingNotices.shift()) !== "undefined") {
      printToUser(ctx, notice, userName, NOTICE_COLOR_THEME.userError);
    }
    userChatInfo.storeToKV(ctx);
  }
  static clearAll(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const keysMap = kv.get(KV_KEYS.userChatKeysMap, {});
    const keyList = Object.values(keysMap);
    keyList.forEach((key) => {
      kv.remove(key);
    });
    kv.remove(KV_KEYS.userChatKeysMap);
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let userChatInfo = kv.get(this.key, null);
    if (userChatInfo) {
      this.pendingNotices = userChatInfo.pendingNotices;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    kv.set(this.key, this);
  }
  addNotice(ctx, futureNotice) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    this.pendingNotices.push(futureNotice);
  }
};
var GlobalStatsTimeSeries = class _GlobalStatsTimeSeries {
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const sObj = kv.get(KV_KEYS.currentSession);
    this.sessionID = sObj.sessionID;
    this.timeSeries = {};
    this.tsMetadata = {};
  }
  static TS_TYPES = {
    userTips: "userTips",
    message: "message"
  };
  static TS_METADATA = {
    refDate: "refDAte",
    maxDate: "maxDAte",
    size: "size",
    span: "span"
  };
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
    let globalTipStat = new _GlobalStatsTimeSeries(ctx);
    globalTipStat.loadFromKV(ctx);
    return globalTipStat;
  }
  static initNewStatObj(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    kv.remove(KV_KEYS.currentGlobalStatsTS);
    const globalStatsTS = new _GlobalStatsTimeSeries(ctx);
    globalStatsTS.storeToKV(ctx);
    return globalStatsTS;
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let globalTipStat = kv.get(KV_KEYS.currentGlobalStatsTS, null);
    if (globalTipStat) {
      this.timeSeries = globalTipStat.timeSeries;
      this.tsMetadata = globalTipStat.tsMetadata;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    kv.set(KV_KEYS.currentGlobalStatsTS, this);
  }
  getTimeSerieNames(tsType) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    return Object.keys(allTS);
  }
  getTimeSerie(tsType, tsName) {
    let allTS = getObjectProperty(this.timeSeries, tsType, {});
    if (Object.hasOwn(allTS, tsName)) {
      return allTS[tsName];
    } else {
      return this.initTimeSerie(tsType, tsName);
    }
  }
  initTimeSerie(tsType, tsName) {
    let allTS = getObjectProperty(this.timeSeries, tsType, {});
    const nbucket = this.getTimeSerieSize(tsType, tsName);
    let list = new Array(nbucket);
    list.fill(0);
    allTS[tsName] = list;
    let newRefDate = 0;
    let trd = 0;
    const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    Object.keys(allTSmetadata).forEach((tsName2) => {
      trd = this.getTimeSerieMetadata(
        tsType,
        tsName2,
        _GlobalStatsTimeSeries.TS_METADATA.refDate,
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
      _GlobalStatsTimeSeries.TS_METADATA.refDate,
      newRefDate
    );
    return list;
  }
  getTimeSerieSize(tsType, tsName) {
    return this.getTimeSerieMetadata(
      tsType,
      tsName,
      _GlobalStatsTimeSeries.TS_METADATA.size,
      _GlobalStatsTimeSeries.FALLBACK_TS_SIZE
    );
  }
  getTimeSerieSpan(tsType, tsName) {
    return this.getTimeSerieMetadata(
      tsType,
      tsName,
      _GlobalStatsTimeSeries.TS_METADATA.span,
      _GlobalStatsTimeSeries.FALLBACK_TS_SPAN
    );
  }
  getTimeSerieMetadata(tsType, tsName, metadataType, fallbackValue) {
    let allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    let metadataObj = getObjectProperty(allTSmetadata, tsName, {});
    const typeDefaultValues = getObjectProperty(
      _GlobalStatsTimeSeries.DEFAULT_TS_METADATA,
      tsType,
      {},
      false
    );
    const defaultValue = getObjectProperty(typeDefaultValues, metadataType, fallbackValue, false);
    let metadata = getObjectProperty(
      metadataObj,
      metadataType,
      defaultValue
    );
    return metadata;
  }
  setTimeSerieMetadata(tsType, tsName, metadataType, newValue) {
    let allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    let metadataObj = getObjectProperty(allTSmetadata, tsName, {});
    metadataObj[metadataType] = newValue;
  }
  slideAllTimeSeries(currentDate, tsType) {
    let allTS = getObjectProperty(this.timeSeries, tsType, {});
    Object.keys(allTS).forEach((tsName) => {
      this.slideTimeSeries(currentDate, tsType, tsName);
    });
  }
  slideTimeSeries(currentDate, tsType, tsName) {
    const refDate = this.getTimeSerieMetadata(
      tsType,
      tsName,
      _GlobalStatsTimeSeries.TS_METADATA.refDate,
      0
    );
    const span = this.getTimeSerieSpan(tsType, tsName);
    if (refDate === 0) {
      this.setTimeSerieMetadata(
        tsType,
        tsName,
        _GlobalStatsTimeSeries.TS_METADATA.refDate,
        currentDate + span
      );
    } else if (currentDate - refDate >= 0) {
      const nbucket = Math.ceil((currentDate - refDate) / span);
      let allTS = getObjectProperty(this.timeSeries, tsType, {});
      Object.values(allTS).forEach((list) => {
        for (let i = 0; i < nbucket; i++) {
          list.unshift(0);
          list.pop();
        }
      });
      this.setTimeSerieMetadata(
        tsType,
        tsName,
        _GlobalStatsTimeSeries.TS_METADATA.refDate,
        refDate + nbucket * span
      );
    }
  }
  processTip(userName, tip) {
    const tsType = _GlobalStatsTimeSeries.TS_TYPES.userTips;
    const span = this.getTimeSerieSpan(tsType, userName);
    let list = this.getTimeSerie(tsType, userName);
    const refDate = this.getTimeSerieMetadata(
      tsType,
      userName,
      _GlobalStatsTimeSeries.TS_METADATA.refDate,
      0
    );
    const maxDate = this.getTimeSerieMetadata(
      tsType,
      userName,
      _GlobalStatsTimeSeries.TS_METADATA.maxDate,
      0
    );
    if (tip.date > maxDate) {
      let idx = Math.floor((refDate - tip.date) / span);
      list[idx] = list[idx] + tip.tokens;
      this.setTimeSerieMetadata(
        tsType,
        userName,
        _GlobalStatsTimeSeries.TS_METADATA.maxDate,
        tip.date
      );
    }
  }
};
var GlobalStatsCompute = class {
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const sObj = kv.get(KV_KEYS.currentSession);
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
      GlobalStatsTimeSeries.TS_METADATA.refDate,
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
    const tsType = GlobalStatsTimeSeries.TS_TYPES.userTips;
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
    const tsType = GlobalStatsTimeSeries.TS_TYPES.userTips;
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
    const tsType = GlobalStatsTimeSeries.TS_TYPES.userTips;
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
var CallbacksManager = class _CallbacksManager {
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const sObj = kv.get(KV_KEYS.currentSession);
    this.sessionID = sObj.sessionID;
    this.activeCallbacks = {};
  }
  static getFromKV(ctx) {
    let manager = new _CallbacksManager(ctx);
    manager.loadFromKV(ctx);
    return manager;
  }
  static initNewManager(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const oldManager = this.getFromKV(ctx);
    oldManager.cancelAll(ctx);
    kv.remove(KV_KEYS.callbacksManager);
    const newManager = new _CallbacksManager(ctx);
    newManager.storeToKV(ctx);
    return newManager;
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let manager = kv.get(KV_KEYS.callbacksManager, null);
    if (manager) {
      this.activeCallbacks = manager.activeCallbacks;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    kv.set(KV_KEYS.callbacksManager, this);
  }
  createAllDefaults(ctx) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
    Object.keys(CALLBACKS_INFO).forEach((label) => {
      const cInfo = CALLBACKS_INFO[label];
      if (cInfo.enabled) {
        this.create(ctx, label, cInfo.defaultDelay, cInfo.defaultRepeating, null);
      }
    });
  }
  create(ctx, label, delay = null, repeating = null, copyFrom = null) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
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
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
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
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
    const label = callback.label;
    const aInfo = getObjectProperty(this.activeCallbacks, label, null);
    if (aInfo) {
      const bInfo = getObjectProperty(CALLBACKS_INFO, aInfo.baseCallback, null);
      if (bInfo && bInfo.func) {
        console.log(aInfo);
        logIt(Date.now());
        if (!aInfo.defaultRepeating) {
          delete this.activeCallbacks[label];
          this.storeToKV(ctx);
        }
        bInfo.func(ctx);
      }
    }
  }
};
var ModuleBase = class {
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    let sObj = kv.get(KV_KEYS.currentSession, null);
    if (!sObj) {
      sessionManageEnter(ctx);
      sObj = kv.get(KV_KEYS.currentSession);
    }
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
    let module = new classClass(ctx);
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
      Object.entries(this.SETTINGS_INFO).forEach(([sName, sInfo]) => {
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
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
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
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const kvKey = this.getKVKey();
    kv.set(kvKey, this);
  }
};
var ModuleChatFilter = class extends ModuleBase {
  onMessage(ctx) {
    const { message = null, user = null, kv = null } = ctx;
    const userName = user.username;
    UserChatInfo.sendPendingNotices(ctx, userName);
  }
  onMessageTransform(ctx) {
    const { message = null, user = null, kv = null } = ctx;
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
      let rl = [];
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
        let v = new Array(s.length - len + 1);
        for (let i = 0; i < v.length; i++) {
          v[i] = s.slice(i, i + len);
        }
        return v;
      }
      if (!(str1 === null || str1 === void 0 ? void 0 : str1.length) || !(str2 === null || str2 === void 0 ? void 0 : str2.length)) {
        return 0;
      }
      let s1 = str1.length < str2.length ? str1 : str2;
      let s2 = str1.length < str2.length ? str2 : str1;
      let pairs1 = getNGrams(s1, gramSize);
      let pairs2 = getNGrams(s2, gramSize);
      let set = new Set(pairs1);
      let total = pairs2.length;
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
    function searchBadWord(badWordList, fuzzyScoreMin) {
      const collator = Intl.Collator("en-US", { sensitivity: "base" });
      let foundBadWords2 = [];
      let found = false;
      words.forEach((word) => {
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
    foundBadWords = searchBadWord(SETTINGS.chatBadWords, SETTINGS.chatFuzzyScoreForBW);
    if (foundBadWords.length > 0) {
      foundBadWords.forEach((bw) => {
        let newWord = bw.slice(0, 1);
        newWord = newWord.padEnd(bw.length, ".");
        newMessage = newMessage.replaceAll(bw, newWord);
        message.setBody(newMessage);
      });
    }
    foundBadWords = searchBadWord(SETTINGS.chatVeryBadWords, SETTINGS.chatFuzzyScoreForVBW);
    if (foundBadWords.length > 0) {
      message.setSpam(true);
      const n = user.username + " " + SETTINGS.chatNoticeToUserVBW;
      UserChatInfo.addPendingNotice(ctx, user.username, n);
    }
  }
};
var ModuleTimer = class _ModuleTimer extends ModuleBase {
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    super(ctx);
    this.TIMER_STATUS = this.constructor.TIMER_STATUS;
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
  static TIMER_STATUS = {
    running: "running",
    frozen: "frozen",
    justStoped: "justStoped",
    unknown: "unknown",
    created: "created",
    deleted: "deleted"
  };
  _callback(ctx) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
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
      status: this.TIMER_STATUS.created,
      timerInfo: timer
    };
  }
  deleteLiveTimer(ctx, name) {
    this.stopTimer(ctx, name);
    delete this.liveTimers[name];
    return { status: this.TIMER_STATUS.deleted };
  }
  startTimer(ctx, name) {
    const availlableTimers = this.getAvaillableTimers(ctx);
    const timer = getObjectProperty(availlableTimers, name, null, false);
    if (timer) {
      const oldStatus = getObjectProperty(this.activeTimers, name, null, false);
      if (oldStatus && oldStatus.state === this.TIMER_STATUS.running) {
        return oldStatus.state;
      }
      let newStatus = null;
      let callbackLabel = null;
      let length = null;
      let repeating = null;
      let startCallback = false;
      if (oldStatus && oldStatus.state === this.TIMER_STATUS.frozen) {
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
        newStatus.state = this.TIMER_STATUS.running;
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
        return { status: this.TIMER_STATUS.running };
      }
      return { status: this.TIMER_STATUS.unknown };
    } else {
      return { status: this.TIMER_STATUS.unknown };
    }
  }
  freezeTimer(ctx, name) {
    const timerStatus = getObjectProperty(this.activeTimers, name, null, false);
    if (timerStatus) {
      const callbacksManager = CallbacksManager.getFromKV(ctx);
      callbacksManager.cancel(ctx, timerStatus.callbackLabel);
      delete this.activeCallbacks[timerStatus.callbackLabel];
      timerStatus.state = this.TIMER_STATUS.frozen;
      if (timerStatus.repeating) {
        timerStatus.remainingLength = timerStatus.timerLength;
      } else {
        timerStatus.remainingLength = timerStatus.timerLength - Math.round((Date.now() - timerStatus.lastStartTime) / 1e3);
      }
      this.activeTimers[name] = timerStatus;
      callbacksManager.storeToKV(ctx);
      return { status: this.TIMER_STATUS.frozen };
    } else {
      return { status: this.TIMER_STATUS.unknown };
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
      return { status: this.TIMER_STATUS.justStoped };
    } else {
      return { status: this.TIMER_STATUS.unknown };
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
  getStatus(ctx) {
    const availlableTimers = this.getAvaillableTimers(ctx);
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
function commandProcessor(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
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
          let cliInfo = {
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
    if (origBody.startsWith(SETTINGS.cliBaseStaffCommand)) {
      loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS, origBody);
    } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand)) {
      loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, origBody);
    }
  }
}
function tipUpdateStatData(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  const globalTipStat = GlobalStatsTimeSeries.getFromKV(ctx);
  const currentDate = Date.now();
  globalTipStat.slideAllTimeSeries(currentDate, GlobalStatsTimeSeries.TS_TYPES.userTips);
  const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
  const keyList = Object.keys(keysMap);
  keyList.forEach((userName) => {
    let userTipInfo = UserTipInfo.getFromKV(ctx, userName);
    let extendedTip = {};
    while (typeof (extendedTip = userTipInfo.tipList.shift()) !== "undefined") {
      globalTipStat.processTip(userName, extendedTip);
    }
    userTipInfo.storeToKV(ctx);
  });
  globalTipStat.storeToKV(ctx);
}
function onTipReceived(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  UserTipInfo.updateUserTips(ctx);
}
function onMessage(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  const origBody = message.orig.trim();
  if (origBody[0] === COMMAND_START_CHAR) {
    commandProcessor(ctx);
  }
  const chatFilter = ModuleChatFilter.getFromKV(ctx);
  chatFilter.onMessage(ctx);
  chatFilter.storeToKV(ctx);
}
function onMessageTransform(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
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
  const { app = null, user = null, room = null, kv = null, tip = null } = ctx;
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
  const { app = null, user = null, room = null, kv = null, tip = null } = ctx;
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
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  if (user.isOwner || user.colorGroup === CB_USER_GROUPS.owner.userColor) {
    sessionManageEnter(ctx);
  }
}
function onUserLeave(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  if (user.isOwner || user.colorGroup === CB_USER_GROUPS.owner.userColor) {
    sessionManageLeave(ctx);
  }
}
function onCallback(ctx) {
  const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
  const manager = CallbacksManager.getFromKV(ctx);
  manager.onEvent(ctx);
}
function logIt(message) {
  const stack = new Error().stack;
  const caller = stack.split("\n")[2].trim().split(/\s+/)[1];
  console.log(message + "\nCaller ----> " + caller);
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
function debugGlobalStatInit(ctx) {
  GlobalStatsTimeSeries.initNewStatObj(ctx);
}
function debugSessionInit(ctx) {
  Session.initNewSession(ctx);
}
function debugSessionCreate(ctx) {
  sessionManageEnter(ctx, true);
}
function debugSessionClear(ctx) {
  Session.clear(ctx);
}
function debugProcessTips(ctx) {
  tipUpdateStatData(ctx);
}
function debugClearTips(ctx) {
  UserTipInfo.clearAll(ctx);
}
function debugClearStats(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  kv.remove(KV_KEYS.currentGlobalStatsTS);
}
function debugPrintTips(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
  const keyList = Object.keys(keysMap);
  let l = [];
  keyList.forEach((userName) => {
    let userTipInfo = UserTipInfo.getFromKV(ctx, userName);
    l.push(userTipInfo.toString());
  });
  let m = l.join("\n");
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
}
function debugPrintStats(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  const stat = GlobalStatsTimeSeries.getFromKV(ctx);
  logIt("Stats are");
  console.log(stat);
}
function debugClearKV(ctx, args) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  if (args && args.length === 1) {
    const key = args[0];
    kv.remove(key);
  } else {
    kv.clear();
  }
}
function debugPrintKV(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
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
function testExtendClass(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  let m = ModuleChatFilter.getFromKV(ctx);
}
function testDebugCommand(ctx) {
  printCommandResult(ctx, "Good you can run a command", NOTICE_COLOR_THEME.help);
}
function testPerfKV(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  logIt("testing KV perf");
  let origBody = message.orig.trim().toLowerCase();
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
function pouet() {
  var CBentryPoints = [
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
pouet();
ModuleTimer.extendSettings();
ModuleTimer.extendCallback();
updateSettings();

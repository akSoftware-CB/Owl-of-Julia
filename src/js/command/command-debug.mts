import { CallbacksManager } from "../app-module/CallbacksManager.mjs";
import { GlobalStatsTimeSeries } from "../app-module/GlobalStatsTimeSeries.mjs";
import { UserTipInfo } from "../app-module/UserTipInfo.mjs";
import { CBcontext } from "../cb/cb-api.mjs";
import { NOTICE_COLOR_THEME, printCommandResult } from "../cli/cli-print.mjs";
import { Session, sessionManageEnter, sessionManageLeave } from "../session-management.mjs";
import { tipUpdateStatData } from "../tip-management.mjs";
import { KV_KEYS } from "../tool/kv.mjs";
import { logIt } from "../tool/log.mjs";
import { KeyMap } from "../tool/tool.mjs";
import { CAPABILITY } from "../user-management.mjs";
import { Args, CommandInfoStore, extendAvaillableStaffCommands } from "./command-processor.mjs";



const AVAILABLE_STAFF_COMMANDS: CommandInfoStore = [
    { name: 'debug', subCommand: 'clearKV', capabilities: CAPABILITY.debugChange, 
    func: debugClearKV, help: 'clearing KV or removing KV entry' },
    { name: 'debug', subCommand: 'printKV', capabilities: CAPABILITY.debugShow, 
    func: debugPrintKV, help: 'printing some KV content for dev/debug' },

    { name: 'debug', subCommand: 'sessionClear', capabilities: CAPABILITY.debugChange, 
    func: debugSessionClear, help: 'clear current session data' },
    { name: 'debug', subCommand: 'sessionInit', capabilities: CAPABILITY.debugChange, 
    func: debugSessionInit, help: 'init a new session' },
    { name: 'debug', subCommand: 'sessionEnter', capabilities: CAPABILITY.debugChange, 
    func: debugSessionEnter, help: 'Call sessionEnter handler' },
    { name: 'debug', subCommand: 'sessionLeave', capabilities: CAPABILITY.debugChange, 
    func: debugSessionLeave, help: 'Call sessionLeave handler' },

    { name: 'debug', subCommand: 'callbackEnable', capabilities: CAPABILITY.debugChange, 
    func: debugEnableCallbacks, help: 'enable default callback' },
    { name: 'debug', subCommand: 'callbackCancel', capabilities: CAPABILITY.debugChange, 
    func: debugCancelCallbacks, help: 'cancel all callback' },

    { name: 'debug', subCommand: 'printTips', capabilities: CAPABILITY.debugShow, 
    func: debugPrintTips, help: 'printing user tips info for dev/debug' },
    { name: 'debug', subCommand: 'clearTips', capabilities: CAPABILITY.debugChange, 
    func: debugClearTips, help: 'clear user tips info' },
    { name: 'debug', subCommand: 'processTips', capabilities: CAPABILITY.debugChange, 
    func: debugProcessTips, help: 'process user tipsinfo and update stats' },

    { name: 'debug', subCommand: 'statsClear', capabilities: CAPABILITY.debugChange, 
    func: debugClearStats, help: 'clear Stats' },
    { name: 'debug', subCommand: 'statsPrint', capabilities: CAPABILITY.debugChange, 
    func: debugPrintStats, help: 'printing Stats' },
];
export function init() {
    extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS);
}


// KV
function debugClearKV(ctx: CBcontext, args: Args) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars   
    const { message = null, user = null, room = null, kv } = ctx;

    if ( args && args.length === 1) {
        const key = args[0];
        kv.remove(key);
    } else {
        kv.clear();
    }
}

function debugPrintKV(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars   
    const { message = null, user = null, room = null, kv } = ctx;

    let v = null ;
    let m = '' ;
    Object.values(KV_KEYS).forEach(key => {
        try {
            v = kv.get(key);
            m = key + ': ' + JSON.stringify(v, null, '\t'); 
            printCommandResult(ctx,m, NOTICE_COLOR_THEME.staff);        
        }
        catch (ReferenceError) {
            logIt('unknown key: ' + key);
        }
    });
}

// Session
function debugSessionInit(ctx: CBcontext) {
    Session.initNewSession(ctx);
}

function debugSessionEnter(ctx: CBcontext) {
    sessionManageEnter(ctx, true);
}

function debugSessionLeave(ctx: CBcontext) {
    sessionManageLeave(ctx);
}

function debugSessionClear(ctx: CBcontext) {
    Session.clear(ctx);
}

// Callbacks
function debugEnableCallbacks(ctx: CBcontext) {
    const manager = CallbacksManager.getFromKV(ctx);
    manager.createAllDefaults(ctx);
    manager.storeToKV(ctx);
}

function debugCancelCallbacks(ctx: CBcontext) {
    const manager = CallbacksManager.getFromKV(ctx);
    manager.cancelAll(ctx);
    manager.storeToKV(ctx);
}

// Tips
function debugPrintTips(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars    
    const { message = null, user = null, room = null, kv, tip = null } = ctx;


    const keysMap: KeyMap = kv.get(KV_KEYS.userTipsKeysMap, {}) as KeyMap;
    const keyList = Object.keys(keysMap);
    const l: string [] = [] ;
    keyList.forEach(userName => {
        const userTipInfo = UserTipInfo.getFromKV(ctx, userName);
        l.push(userTipInfo.toString()) ;
    });

    const m = l.join('\n');
    printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
}

function debugProcessTips(ctx: CBcontext) {
    tipUpdateStatData(ctx);
}

function debugClearTips(ctx: CBcontext) {
    UserTipInfo.clearAll(ctx);
}

// Stats
// function debugGlobalStatInit(ctx: CBcontext) {
//     GlobalStatsTimeSeries.initNewStatObj(ctx);
// }

function debugClearStats(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv, tip = null } = ctx;

    kv.remove(KV_KEYS.currentGlobalStatsTS);    
}

function debugPrintStats(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars       
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;

    const stat = GlobalStatsTimeSeries.getFromKV(ctx);
    logIt('Stats are');
    console.log(stat);
 }



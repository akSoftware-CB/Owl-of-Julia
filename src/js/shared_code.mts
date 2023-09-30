

import { NOTICE_COLOR_THEME, printToOwner } from "./cli/cli-print.mjs";
import { SETTINGS, updateSettings } from "./settings.mjs";
import { COMMAND_START_CHAR } from "./defaults.mjs";
import { KV_KEYS } from "./tool/kv.mjs";
import { CB_USER_GROUPS, CBcontext } from "./cb/cb-api.mjs";
import { CallbacksManager } from "./app-module/CallbacksManager.mjs";
import { ModuleTimer } from "./app-module/ModuleTimer.mjs";
import { UserTipInfo } from "./app-module/UserTipInfo.mjs";
import { commandProcessor } from "./command/command-processor.mjs";
import { sessionManageEnter, sessionManageLeave } from "./session-management.mjs";
import { logIt } from "./tool/log.mjs";
import { ModuleChatFilter } from "./app-module/ModuleChatFilter.mjs";


function onTipReceived(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;

    UserTipInfo.updateUserTips(ctx);
}

function onMessage(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, user = null, room = null, kv = null } = ctx;

    const origBody = message.orig.trim();
    if (origBody[0] === COMMAND_START_CHAR) {
        commandProcessor(ctx);
    }
    const chatFilter: ModuleChatFilter = ModuleChatFilter.getFromKV(ctx) as ModuleChatFilter;
    chatFilter.onMessage(ctx);
    chatFilter.storeToKV(ctx);
}

function onMessageTransform(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, user = null, room = null, kv = null } = ctx;

    const origBody = message.orig.trim();
    if (origBody[0] === COMMAND_START_CHAR) {
        if (origBody.startsWith(SETTINGS.cliBaseStaffCommand) && !SETTINGS.cliBroadcastStaffCmd) {
            message.setSpam(true);
        } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand) && !SETTINGS.cliBroadcastUserCmd) {
            message.setSpam(true);
        }
        commandProcessor(ctx, true);
    } else {
        const chatFilter: ModuleChatFilter = ModuleChatFilter.getFromKV(ctx) as ModuleChatFilter;
        chatFilter.onMessageTransform(ctx);
        chatFilter.storeToKV(ctx);
    }
}

function onAppStart(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { app, user = null, room = null, kv, tip = null } = ctx;

    const sObj = kv.get(KV_KEYS.currentSession, null);
    if (!sObj) {
        sessionManageEnter(ctx);
    }

    const m = `⚡️ ${app.name} (v${app.version}) has started.`;
    printToOwner(ctx, m, NOTICE_COLOR_THEME.staff);

    const manager = CallbacksManager.initNewManager(ctx);
    manager.createAllDefaults(ctx);
    manager.storeToKV(ctx);

    logIt("App started");
}

function onAppStop(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { app, user = null, room = null, kv = null, tip = null } = ctx;

    const m = `⚡️ ${app.name} has stopped`;
    printToOwner(ctx, m, NOTICE_COLOR_THEME.staff);

    logIt("App stoped");
}

function onBroadcastStart(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sessionManageEnter(ctx);
    logIt("Broadcast started YOOOUUUUPPPIIIII");
}

function onBroadcastStop(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sessionManageLeave(ctx);
    logIt("Broadcast stoped,  gniininii");
}

function onUserEnter(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars    
    const { message = null, user, room = null, kv = null, tip = null } = ctx;
    if (user.isOwner || user.colorGroup === CB_USER_GROUPS.owner.userColor) {
        sessionManageEnter(ctx);
    }
}

function onUserLeave(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user, room = null, kv = null, tip = null } = ctx;    
    if (user.isOwner || user.colorGroup === CB_USER_GROUPS.owner.userColor) {
        sessionManageLeave(ctx);
    }
}

function onCallback(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;    

    const manager = CallbacksManager.getFromKV(ctx);
    manager.onEvent(ctx);
}


function bundlerHack() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            onUserLeave,
        ]; 
}


bundlerHack();
// init SETTINGS global var
ModuleTimer.extendSettings();
ModuleTimer.extendCallback();
//let SETTINGS = SETTINGS_INFO;
//SETTINGS = getSettings()
updateSettings();


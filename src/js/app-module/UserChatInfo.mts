import { CBcontext } from "../cb/cb-api.mjs";
import { NOTICE_COLOR_THEME, printToUser } from "../cli/cli-print.mjs";
import { Session } from "../session-management.mjs";
import { KV_KEYS } from "../tool/kv.mjs";
import { GenericID, SessionID, getRandomID } from "../tool/tool.mjs";

type FutureNotice = string ;

interface KeyMap {
    [key: string]: GenericID,
}


class UserChatInfo {
    userName: string;
    sessionID: SessionID;
    key: string;
    pendingNotices: FutureNotice[];

    constructor(ctx: CBcontext, userName: string) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
        
        this.userName = userName;
        const sObj = Session.getCurrentSession(ctx);
        this.sessionID = sObj.sessionID;
        this.key = UserChatInfo.getUserChatKey(ctx, userName);
        this.pendingNotices = [];

    }

    static getFromKV(ctx: CBcontext, userName: string) {
        const userChatInfo = new UserChatInfo(ctx, userName);
        userChatInfo.loadFromKV(ctx);
        return userChatInfo;
    }

    static getUserChatKey(ctx: CBcontext, userName: string) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;
    
        let key = null;
        const keysMap: KeyMap = kv.get(KV_KEYS.userChatKeysMap, {}) as KeyMap;
        if (Object.hasOwn(keysMap, userName)) {
            key = keysMap[userName];
        } else {
            key = userName + '-' + getRandomID(4);
            keysMap[userName] = key;
            kv.set(KV_KEYS.userChatKeysMap, keysMap);
        }
        return key;
    }    
    
    // TODO improve pending notice from string to object
    static addPendingNotice(ctx: CBcontext, userName: string, futureNotice: FutureNotice) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    
        const userChatInfo = UserChatInfo.getFromKV(ctx, userName);
        userChatInfo.addNotice(ctx, futureNotice);
        userChatInfo.storeToKV(ctx);
    }

    static sendPendingNotices(ctx: CBcontext, userName: string) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    
        const userChatInfo = UserChatInfo.getFromKV(ctx, userName);
        let notice: FutureNotice | undefined = '' ;
        while (typeof (notice = userChatInfo.pendingNotices.shift()) !== "undefined") {
            printToUser(ctx, notice, userName, NOTICE_COLOR_THEME.userError);            
        }

        userChatInfo.storeToKV(ctx);
    }

    static clearAll(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;
    
        const keysMap: KeyMap = kv.get(KV_KEYS.userChatKeysMap, {}) as KeyMap;
        const keyList = Object.values(keysMap);
        keyList.forEach(key => {
            kv.remove(key);
        });
        kv.remove(KV_KEYS.userChatKeysMap);
    }

    loadFromKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        const userChatInfo: UserChatInfo = kv.get(this.key, null) as UserChatInfo;
        if (userChatInfo) {
            this.pendingNotices = userChatInfo.pendingNotices;
        }
    }

    storeToKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        kv.set(this.key, this);
    }

    addNotice(ctx: CBcontext, futureNotice: FutureNotice) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv = null, tip = null } = ctx;

        this.pendingNotices.push(futureNotice);
    }

}

export {UserChatInfo} ;
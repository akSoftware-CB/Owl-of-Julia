import { CBcontext } from "../cb/cb-api.mjs";
import { Session } from "../session-management.mjs";
import { KV_KEYS } from "../tool/kv.mjs";
import { KeyMap } from "../tool/tool.mjs";
import { EpochMs, SessionID, getRandomID,  } from "../tool/tool.mjs";

interface ExtendedTip {
    tokens: number,
    message: string,
    isAnon: boolean,
    date: EpochMs,
    userName: string,
    sessionID: SessionID,    
}

class UserTipInfo {
    tipList: ExtendedTip[];
    tipTotal: number;
    userName: string;
    sessionID: SessionID;
    key: string;

    constructor(ctx: CBcontext, userName: string) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars        
        const { message = null, user = null, room = null, kv, tip = null } = ctx;
        
        this.tipList = [];
        this.tipTotal = 0;
        this.userName = userName;
        const sObj  = Session.getCurrentSession(ctx);
        this.sessionID = sObj.sessionID;
        this.key = UserTipInfo.getUserTipKey(ctx, userName);

    }

    static getFromKV(ctx: CBcontext, userName: string) {
        const userTipInfo = new UserTipInfo(ctx, userName);
        userTipInfo.loadFromKV(ctx);
        return userTipInfo;
    }

    static getUserTipKey(ctx: CBcontext, userName: string) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;
    
        let key = null;
        const keysMap: KeyMap = kv.get(KV_KEYS.userTipsKeysMap, {}) as KeyMap;
        if (Object.hasOwn(keysMap, userName)) {
            key = keysMap[userName];
        } else {
            key = userName + '-' + getRandomID(4);
            keysMap[userName] = key;
            kv.set(KV_KEYS.userTipsKeysMap, keysMap);
        }
        return key;
    }    
    
    static updateUserTips(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user, room = null, kv = null, tip = null } = ctx;
    
        const userName: string = user.username as string;
        const userTipInfo = UserTipInfo.getFromKV(ctx, userName);
        userTipInfo.addTip(ctx);
        userTipInfo.storeToKV(ctx);
    }

    static clearAll(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars        
        const { message = null, user = null, room = null, kv, tip = null } = ctx;
    
        const keysMap: KeyMap = kv.get(KV_KEYS.userTipsKeysMap, {}) as KeyMap;
        const keyList = Object.values(keysMap);
        keyList.forEach(key => {
            kv.remove(key);
        });
        kv.remove(KV_KEYS.userTipsKeysMap);
    }

    loadFromKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        const userTipInfo: UserTipInfo = kv.get(this.key, null) as UserTipInfo;
        if (userTipInfo) {
            this.tipList = userTipInfo.tipList;
            this.tipTotal = userTipInfo.tipTotal;
        }
    }

    storeToKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars        
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        kv.set(this.key, this);
    }

    addTip(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user, room = null, kv = null, tip } = ctx;

        const extendedTip: ExtendedTip = {
            tokens: tip.tokens as number,
            message: tip.message as string,
            isAnon: tip.isAnon as boolean,
            date: Date.now(),
            userName: user.username as string,
            sessionID: this.sessionID,
        };

        this.tipList.push(extendedTip);
        this.tipTotal = this.tipTotal + (tip.tokens as number);
    }

    toString() {
        let m = '' ;
        m = m + JSON.stringify(this.tipList);
        m = m + '\n' + JSON.stringify(this.tipTotal);
        return m;
    }
}


export {UserTipInfo, ExtendedTip};
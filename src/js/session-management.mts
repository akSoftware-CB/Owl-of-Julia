
import { SETTINGS } from "./settings.mjs";
import { KV_KEYS } from "./tool/kv.mjs";
import { CBcontext } from "./cb/cb-api.mjs";
import { EpochMs, SessionID, getRandomID } from "./tool/tool.mjs";
import { UserTipInfo } from "./app-module/UserTipInfo.mjs";
import { tipUpdateStatData } from "./tip-management.mjs";
import { UserChatInfo } from "./app-module/UserChatInfo.mjs";
import { GlobalStatsTimeSeries } from "./app-module/GlobalStatsTimeSeries.mjs";
import { CallbacksManager } from "./app-module/CallbacksManager.mjs";
import { printToOwner } from "./cli/cli-print.mjs";
import { logIt } from "./tool/log.mjs";

function sessionManageEnter(ctx: CBcontext, force = false) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {user = null, room = null, kv} = ctx;
    const currentDate = Date.now();

    const lastStart: EpochMs = kv.get(KV_KEYS.sessionStartDate, 0) as EpochMs;
    const lastEnter: EpochMs = kv.get(KV_KEYS.sessionLastEnterDate, 0) as EpochMs;
    const lastLeave: EpochMs = kv.get(KV_KEYS.sessionLastLeaveDate, 0) as EpochMs;


    const minTimeBetweenSession     = SETTINGS.sessionMinTimeBetweenSession * 60 * 1000 ;
    const maxTimeToRejoin           = SETTINGS.sessionMaxTimeToRejoin * 60 * 1000 ;
    const maxSessionLength          = SETTINGS.sessionMaxSessionLength * 60 * 1000 ;

    function createNewSession(first: boolean) {
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

    let keepSession = 0 ;
    let newSession = 0 ;
    let info = ''
    if (lastStart && lastEnter) {
        if ((currentDate - lastLeave) < maxTimeToRejoin) {
            // same session
            keepSession = keepSession + 1;
            info = info + 'A';
        }
        if ((currentDate - lastEnter) < (maxTimeToRejoin +  maxSessionLength)) {
            // same session
            keepSession = keepSession + 1;
            info = info + 'B';
        }
        if ((currentDate - lastStart) < (maxTimeToRejoin +  maxSessionLength)) {
            // same session
            keepSession = keepSession + 1;
            info = info + 'C';
        }

        if ((currentDate - lastLeave) > minTimeBetweenSession ) {
            // new Session
            newSession = newSession + 1 ;
            info = info + 'G';
        }
        if ((currentDate - lastEnter) > (minTimeBetweenSession + maxSessionLength)) {
            // new Session
            newSession = newSession + 1 ;
            info = info + 'H';
        }
        if ((currentDate - lastStart) > (minTimeBetweenSession + maxSessionLength)) {
            // new Session
            newSession = newSession + 1 ;
            info = info + 'I';
        }

        if (newSession > keepSession || force) {
            printToOwner(ctx, "Will create a new session. "+ keepSession + '' + newSession + info);
            createNewSession(false);
        } else {
            printToOwner(ctx, "Keeping existing session from: " + (new Date(lastStart)).toString());
        }
    } else {
        printToOwner(ctx, "Hello, you are new user :-)");
        createNewSession(true);
    }

    kv.set(KV_KEYS.sessionLastEnterDate, currentDate);
}

function sessionManageLeave(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {user = null, room = null, kv } = ctx;
    const currentDate = Date.now();

    kv.set(KV_KEYS.sessionLastLeaveDate, currentDate);
}

class Session {
    sessionID: SessionID;
    startDate: EpochMs;

    constructor(currentDate: EpochMs){
        this.sessionID = getRandomID(8);
        this.startDate = currentDate;
    }

    static  getCurrentSession(ctx: CBcontext): Session {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {user = null, room = null, kv} = ctx;

        let sObj: Session = kv.get(KV_KEYS.currentSession) as Session;
        if (!sObj) {
            sessionManageEnter(ctx);
            sObj = kv.get(KV_KEYS.currentSession) as Session;
        }
        return sObj
    }


    static  initNewSession(
        ctx: CBcontext, currentDate: EpochMs = (null as unknown as EpochMs), 
        first = false
        ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {user = null, room = null, kv } = ctx;
    
        let startDate = currentDate;
        if (!startDate) {
            startDate = Date.now();
        } 
        
        if (first) {
            logIt('First session');
            kv.set(KV_KEYS.sessionStartDate, startDate);
            kv.set(KV_KEYS.sessionLastEnterDate, startDate);
            kv.set(KV_KEYS.sessionLastLeaveDate, 0);
    
        } else {
            kv.set(KV_KEYS.sessionStartDate, startDate);
        }
    
        const previousSession = kv.get(KV_KEYS.currentSession, null);
    
        const newSession = new Session(startDate);
    
        kv.set(KV_KEYS.currentSession, newSession);
        if (previousSession) {
            const tl: Session[] = kv.get(KV_KEYS.sessionHistory, []) as Session[];
            const count = tl.unshift(newSession);
            if (count > SETTINGS.sessionHistoryMaxLength) {
                tl.pop();
            }
            kv.set(KV_KEYS.sessionHistory, tl);
        }
    
        printToOwner(ctx, "New Session created :-)")
    }
    
    static clear(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {user = null, room = null, kv} = ctx;
    
        kv.remove(KV_KEYS.sessionStartDate);    
        kv.remove(KV_KEYS.sessionLastEnterDate);
        kv.remove(KV_KEYS.sessionLastLeaveDate);
        kv.remove(KV_KEYS.currentSession);
    }
    
}

export {sessionManageEnter, sessionManageLeave, Session};
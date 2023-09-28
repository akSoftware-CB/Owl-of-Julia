import { CBcontext } from "../cb/cb-api.mjs";
import { Session } from "../session-management.mjs";
import { KV_KEYS } from "../tool/kv.mjs";
import { logIt } from "../tool/log.mjs";
import { SessionID, getObjectProperty } from "../tool/tool.mjs";
import { tipUpdateStatData } from "../tip-management.mjs";

interface ActiveCallback {
    label:              string,
    baseCallback:       string,
    defaultDelay:       number,
    defaultRepeating:   boolean,
}

interface ActiveCallbackStore {
    [key: string]: ActiveCallback,
}

//type CallbackFunction = (..._args: unknown[]) => unknown;

interface CallbackInfo {
    enabled: boolean, 
    func: unknown, 
    defaultDelay: number, 
    defaultRepeating: boolean,
}

interface CallbackInfoStore {
    [key: string]: CallbackInfo,
}

const CALLBACKS_INFO: CallbackInfoStore = {
    tipUpdateStatData:    {
        enabled: true, func: tipUpdateStatData, defaultDelay: 5, defaultRepeating: true
    },
};

class CallbacksManager {
    sessionID: SessionID;
    activeCallbacks: ActiveCallbackStore;

    constructor(ctx: CBcontext){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv = null, tip = null } = ctx;

        const sObj = Session.getCurrentSession(ctx);
        this.sessionID = sObj.sessionID;
        this.activeCallbacks = {} as ActiveCallbackStore;
    }

    static getFromKV(ctx: CBcontext) {
        const manager = new CallbacksManager(ctx);
        manager.loadFromKV(ctx);
        return manager;
    }

    static initNewManager(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;
    
        const oldManager = this.getFromKV(ctx);
        oldManager.cancelAll(ctx);

        kv.remove(KV_KEYS.callbacksManager);
        const newManager = new CallbacksManager(ctx);
        newManager.storeToKV(ctx); 

        return newManager;
    }

    loadFromKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        const manager: CallbacksManager = kv.get(KV_KEYS.callbacksManager, null) as CallbacksManager;
        if (manager) {
            this.activeCallbacks = manager.activeCallbacks;
        }
    }    

    storeToKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        kv.set(KV_KEYS.callbacksManager, this);
    }    

    createAllDefaults(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;

        Object.keys(CALLBACKS_INFO).forEach(label => {
            const cInfo = CALLBACKS_INFO[label];
            if (cInfo.enabled) {
                this.create(ctx, label, cInfo.defaultDelay, cInfo.defaultRepeating, 
                    (null as unknown as string));
            }
        });
    }

    create(
        ctx: CBcontext, 
        label: string, 
        delay: number = (null as unknown as number), 
        repeating: boolean = (null as unknown as boolean), 
        copyFrom: string = (null as unknown as string)
        ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                label:              label,
                baseCallback:       baseCallback,
                defaultDelay:       d,
                defaultRepeating:   r,
            };
        }
    }

    cancel(ctx: CBcontext, label: string) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { callback, user = null, room = null, kv = null, tip = null } = ctx;

        callback.cancel(label);
        delete this.activeCallbacks[label];
    }

    cancelAll(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;

        Object.keys(this.activeCallbacks).forEach(label => {
            this.cancel(ctx, label);
        });
    }

    onEvent(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}


export {CallbackInfo, CALLBACKS_INFO, CallbacksManager};


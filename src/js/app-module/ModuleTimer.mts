import { CBcontext } from "../cb/cb-api.mjs";
import { NOTICE_COLOR_THEME, printToEveryone } from "../cli/cli-print.mjs";
import { logIt } from "../tool/log.mjs";
import { EpochMs, getObjectProperty } from "../tool/tool.mjs";
import { CallbacksManager } from "./CallbacksManager.mjs";
import { ModuleBase } from "./ModuleBase.mjs";

interface TimerInfo {
    name: string,
    length: number,
    message: string,
    repeating: boolean,
}

interface TimerInfoStore {
    [key: string]: TimerInfo,
}

interface TimerStatus {
    timerName: string,
    timerMessage: string,
    timerLength: number,
    remainingLength: number,
    callbackLabel: string,
    repeating: boolean,
    startTime: EpochMs,
    lastStartTime: EpochMs,
    state: TIMER_STATUS,
}

interface ActiveTimerStore {
    [key: string]: TimerStatus,    
}

interface ActiveCallbackStore {
    [key: string]: string,
}

interface TimerExtendedInfo extends TimerInfo, TimerStatus {

}

interface TimerExtendedInfoStore {
    [key: string]: TimerExtendedInfo,
}

enum TIMER_STATUS {
    running =        'running',
    frozen =         'frozen',
    justStoped =     'justStoped',
    unknown =        'unknown',
    created =        'created',
    deleted =        'deleted',
}    


class ModuleTimer extends ModuleBase {
    liveTimers: TimerInfoStore ;
    activeTimers: ActiveTimerStore;
    activeCallbacks: ActiveCallbackStore;

    constructor(ctx: CBcontext){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv = null, tip = null } = ctx;

        super(ctx);
        this.liveTimers = {};
        this.activeTimers = {};
        this.activeCallbacks = {};
    }

    static PERSIST_PROPERTIES = ['liveTimers', 'activeTimers', 'activeCallbacks'];
    static NAMES_IN_SETTINGS = ['A', 'B', 'C'];
    static CALLBACK_NAME = 'timerTemplate';
    static SETTING_BASENAME = 'timer'; 
    static CALLBACK_TEMPLATE = {
        enabled: false, func: this.callback, defaultDelay: 3600, defaultRepeating: false
    };
    static SETTINGS_INFO = {
        length: { defaultValue: 60, fromSettings:true, liveUpdate: false, desc: 'timer length in seconds'},
        message: { defaultValue: 'Are you READY ?', fromSettings:true, liveUpdate: false, desc: 'timer message'},
        repeating: { defaultValue: false, fromSettings:true, liveUpdate: false, desc: 'timer is repeating'},
    };

    static callback(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;

        const moduleTimer: ModuleTimer = ModuleTimer.getFromKV(ctx) as ModuleTimer;
        moduleTimer._callback(ctx);
        moduleTimer.storeToKV(ctx);
    }


    _callback(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                logIt('TIMER: Timer not found: ' + timerName);    
            }
        } else {
            logIt('TIMER: Callback not found: ' + callbackLabel);
        }
    }

    addLiveTimer(
        ctx: CBcontext, name: string, length: number, 
        message: string = null as unknown as string, repeating: boolean = false) {
        
        const timer = {
            name: name,
            length: length,
            message: message,
            repeating: repeating,
        }
        this.liveTimers[name] = timer;
        return {
            status: TIMER_STATUS.created,
            timerInfo : timer,
            };
    }

    deleteLiveTimer(ctx: CBcontext, name: string) {
        this.stopTimer(ctx, name);
        delete this.liveTimers[name];
        return { status: TIMER_STATUS.deleted, };        
    }

    startTimer(ctx: CBcontext, name: string) {
        const availlableTimers = this.getAvaillableTimers();
        const timer = getObjectProperty(availlableTimers, name, null, false);

        if (timer) {
            const oldStatus = getObjectProperty(this.activeTimers, name, null, false);
            if (oldStatus && oldStatus.state === TIMER_STATUS.running) {
                return oldStatus.state;
            }

            let newStatus = null;
            let callbackLabel = null;
            let length = null;
            let repeating = null;
            let startCallback = false;
            if (oldStatus && oldStatus.state === TIMER_STATUS.frozen) {
                newStatus = oldStatus;
                callbackLabel = oldStatus.callbackLabel;
                repeating = oldStatus.repeating;
                length = oldStatus.remainingLength;
                oldStatus.timerLength = length;
                startCallback = true;
            } else if (!oldStatus) {
                callbackLabel = this.constructor.CALLBACK_NAME + '__' + name;
                length = timer.length;
                repeating = timer.repeating;

                newStatus = {
                    timerName: name,
                    timerMessage: timer.message,
                    timerLength: length,
                    callbackLabel: callbackLabel,
                    repeating: repeating,
                    startTime: Date.now(),
                    lastStartTime: null,
                    state: null,
                };
                startCallback = true;
            }

            if (startCallback) {
                newStatus.lastStartTime = Date.now();
                newStatus.state =  TIMER_STATUS.running;
        
                const callbacksManager = CallbacksManager.getFromKV(ctx);
                callbacksManager.create(
                    ctx, callbackLabel, length, repeating, this.constructor.CALLBACK_NAME);
                this.activeTimers[name] = newStatus;
                this.activeCallbacks[callbackLabel] = name;
                callbacksManager.storeToKV(ctx);

                return {status: TIMER_STATUS.running};
            }
            return {status: TIMER_STATUS.unknown};
        } else {
            return {status: TIMER_STATUS.unknown};
        }
    }

    freezeTimer(ctx: CBcontext, name: string) {
        const timerStatus = getObjectProperty(this.activeTimers, name, null, false);
        if (timerStatus) {
            const callbacksManager = CallbacksManager.getFromKV(ctx);
            callbacksManager.cancel(ctx, timerStatus.callbackLabel);
            delete this.activeCallbacks[timerStatus.callbackLabel];

            timerStatus.state = TIMER_STATUS.frozen;
            if (timerStatus.repeating) {
                timerStatus.remainingLength = timerStatus.timerLength;    
            } else {
                timerStatus.remainingLength = timerStatus.timerLength 
                - Math.round((Date.now() - timerStatus.lastStartTime) / 1000);    
            }
            this.activeTimers[name] = timerStatus;
            callbacksManager.storeToKV(ctx);
            return {status: TIMER_STATUS.frozen};
        } else {
            return {status: TIMER_STATUS.unknown};
        }
    }

    stopTimer(ctx: CBcontext, name: string) {
        const timerStatus = getObjectProperty(this.activeTimers, name, null, false);
        if (timerStatus) {
            const callbacksManager = CallbacksManager.getFromKV(ctx);
            callbacksManager.cancel(ctx, timerStatus.callbackLabel);
            delete this.activeCallbacks[timerStatus.callbackLabel];
            delete this.activeTimers[name];
            callbacksManager.storeToKV(ctx);
            return {status: TIMER_STATUS.justStoped};
        } else {
            return {status: TIMER_STATUS.unknown};
        }
    }

    stopAllTimer(ctx: CBcontext) {
        const callbacksManager = CallbacksManager.getFromKV(ctx);
        Object.values(this.activeTimers).forEach(timerStatus => {
            callbacksManager.cancel(ctx, timerStatus.callbackLabel);
            delete this.activeCallbacks[timerStatus.callbackLabel];
            delete this.activeTimers[timerStatus.timerName];
        });
        callbacksManager.storeToKV(ctx);
    }

    getStatus(): TimerExtendedInfoStore {
        const availlableTimers = this.getAvaillableTimers();

        Object.entries(availlableTimers).forEach(([tName, tInfo]) => {
            if (Object.hasOwn(this.activeTimers, tName)) {
                const tStatus = this.activeTimers[tName];
                const newInfo: TimerExtendedInfo = {
                    ...tInfo,
                    ...tStatus,
                };
                availlableTimers[tName] = newInfo;
            }
        });
        return availlableTimers as TimerExtendedInfoStore;
    }

    getAvaillableTimers() {
        const staticTimers: TimerInfoStore = this.constructor.getStaticSettings() as TimerInfoStore;

        const timers: TimerInfoStore = {
            ...staticTimers,
            ...this.liveTimers,
        };

        return timers;
    }
}


export {TIMER_STATUS, ModuleTimer};

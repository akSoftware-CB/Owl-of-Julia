import { CBcontext } from "../cb/cb-api.mjs";
import { Session } from "../session-management.mjs";
import { SETTINGS, SETTINGS_INFO, SettingInfo } from "../settings.mjs";
import { SessionID } from "../tool/tool.mjs";
import { CALLBACKS_INFO, CallbackInfo } from "./CallbacksManager.mjs";


interface ModuleSettingsInfoStore {
    [key: string]: SettingInfo;
}

interface StaticSettingsStore{
    [key: string]: StaticSetting,
}

type StaticSetting = unknown;

type PersistProperties = string[];

class ModuleBase {
    sessionID: SessionID;
    data: object;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // ['constructor']: typeof ModuleBase;

    constructor(ctx: CBcontext){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        const sObj = Session.getCurrentSession(ctx);
        this.sessionID = sObj.sessionID;
        this.data = {};
    }

    static PERSIST_PROPERTIES: PersistProperties = ['data'];
    static NAMES_IN_SETTINGS: string[] = null as unknown as string[];
    static CALLBACK_NAME: string = null as unknown as string;
    static SETTING_BASENAME: string = null as unknown as string;
    static CALLBACK_TEMPLATE: CallbackInfo = null as unknown as CallbackInfo;
    static SETTINGS_INFO: ModuleSettingsInfoStore = null as unknown as ModuleSettingsInfoStore;


    static getFromKV(ctx: CBcontext, classClass = this) {
        const module = new classClass(ctx);
        module.loadFromKV(ctx);
        return module;
    }

    static getSettingName(settingName: string, name: string) {
        return this.SETTING_BASENAME + '__' + settingName + '__' + name;
    }

    static extendSettings() {
        if (this.NAMES_IN_SETTINGS && this.SETTING_BASENAME && this.SETTINGS_INFO) {
            this.NAMES_IN_SETTINGS.forEach(name => {
                Object.entries(this.SETTINGS_INFO).forEach(([settingName, sInfo]) => {
                    const newName = this.getSettingName(settingName, name);
                    const newObj = {
                        ...sInfo,
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
        const staticSettings: StaticSettingsStore = {};

        let settingObj: StaticSettingsStore = {};
        this.NAMES_IN_SETTINGS.forEach(name => {
            settingObj = {name: name};
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

    loadFromKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        const kvKey = this.getKVKey();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this.constructor.PERSIST_PROPERTIES) {
            const module = kv.get(kvKey, null);
            if (module) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.constructor.PERSIST_PROPERTIES.forEach(propName => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this[propName] = module[propName];
                });
            }    
        }
    }


    storeToKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        const kvKey = this.getKVKey();
        kv.set(kvKey, this);
    }
}

export {ModuleBase};
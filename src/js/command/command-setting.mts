
import { CBcontext } from "../cb/cb-api.mjs";
import { printCommandResult, NOTICE_COLOR_THEME } from "../cli/cli-print.mjs";
import { CB_SETTINGS_LIST_SEPARATOR } from "../defaults.mjs";
import { LiveSettings, SETTINGS, SETTINGS_CONVERT, SETTINGS_INFO } from "../settings.mjs";
import { KV_KEYS } from "../tool/kv.mjs";
import { CAPABILITY } from "../user-management.mjs";
import { Args, CommandInfoStore, extendAvaillableStaffCommands } from "./command-processor.mjs";


const AVAILABLE_STAFF_COMMANDS: CommandInfoStore = [
    { name: 'settings', subCommand: 'show', capabilities: CAPABILITY.settingsShow, 
    func: cliSettingShowSettings, help: 'showing current settings' },
    { name: 'settings', subCommand: 'showlive', capabilities: CAPABILITY.settingsShow, 
    func: cliSettingShowLiveSettings, help: 'showing overriding settings, stored in KV' },
    { name: 'settings', subCommand: 'setlive', capabilities: CAPABILITY.settingsSet, 
    func: cliSettingSetLiveSetting, help: 'override a setting' },
    { name: 'settings', subCommand: 'clearlive', capabilities: CAPABILITY.settingsSet, 
    func: cliSettingClearLiveSetting, help: 'clear an overrided setting' },
    { name: 'settings', subCommand: 'clearliveall', capabilities: CAPABILITY.settingsSet, 
    func: cliSettingClearAllLiveSettings, help: 'clear all overrided settings' },
];
export function init() {
    extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS);
}



function cliSettingShowSettings(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv = null } = ctx;

    printCommandResult(ctx, JSON.stringify(SETTINGS, null, "\t"), NOTICE_COLOR_THEME.staff);
}

function cliSettingSetLiveSetting(ctx: CBcontext, args: Args) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv } = ctx;

    if (args.length > 1) {
        const key = args[0];
        const v = args[1];
        if (Object.hasOwn(SETTINGS_INFO, key)) {
            const sInfo = SETTINGS_INFO[key];
            const { defaultValue = null, liveUpdate = null, convert = null} = sInfo;            
            if (liveUpdate) {
                let settings: LiveSettings = {};
                settings = kv.get(KV_KEYS.liveSettings, {}) as LiveSettings;
                if (convert && v) {
                    let c = null;
                    let l = null;
                    let nv: string[] = null as unknown as string[];
                    switch (convert) {
                        case SETTINGS_CONVERT.number:
                            c = parseInt(v);
                            if (typeof c === 'number' && c) {
                                settings[key] = c;
                            } else {
                                settings[key] = defaultValue;
                            }
                            break;
                        case SETTINGS_CONVERT.listString:
                            l = v.split(CB_SETTINGS_LIST_SEPARATOR);
                            nv = [] as string[];
                            l.forEach(u => {
                                nv.push(u.trim());
                            });
                            settings[key] = nv;
                            break;
                        case SETTINGS_CONVERT.boolean:
                            c = parseInt(v);
                            if (v === 'true') {
                                settings[key] = true;
                            } else if (v === 'false') {
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

function cliSettingClearLiveSetting(ctx: CBcontext, args: Args) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv} = ctx;

    if (args.length === 1) {
        const key = args[0];
        if (Object.hasOwn(SETTINGS_INFO, key)) {
            const sInfo = SETTINGS_INFO[key];
            const {liveUpdate = null} = sInfo;            
            if (liveUpdate) {
                let settings: LiveSettings = {};
                settings = kv.get(KV_KEYS.liveSettings, {}) as LiveSettings;
                delete settings[key];
                kv.set(KV_KEYS.liveSettings, settings);  
            }
        }
    }
}

function cliSettingClearAllLiveSettings(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv } = ctx;

    const settings = {};
    kv.set(KV_KEYS.liveSettings, settings);  
}


function cliSettingShowLiveSettings(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv } = ctx;

    const settings = kv.get(KV_KEYS.liveSettings, {});
    printCommandResult(ctx, JSON.stringify(settings, null, "\t"), NOTICE_COLOR_THEME.staff);
}


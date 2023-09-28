
import { BASE_STAFF_COMMAND, BASE_USER_COMMAND, CB_SETTINGS_LIST_SEPARATOR } from "./defaults.mjs";
import { KV_KEYS } from "./tool/kv.mjs";


interface SettingsInfoObj {
    cliBroadcastUserCmd: SettingInfo,
    cliBroadcastStaffCmd: SettingInfo,
    cliBaseStaffCommand: SettingInfo,
    cliBaseUserCommand: SettingInfo,
    debugAllowedUsernames: SettingInfo,
    debugEnableRemoteUser: SettingInfo,
    debugAllowOwner:   SettingInfo,
    userStaffMembersAdmin:  SettingInfo,
    userStaffMembersMonitor:  SettingInfo,
    sessionMinTimeBetweenSession:  SettingInfo,
    sessionMaxTimeToRejoin:  SettingInfo,
    sessionMaxSessionLength:  SettingInfo,
    sessionHistoryMaxLength:  SettingInfo,
    chatBadWords:  SettingInfo,
    chatFuzzyScoreForBW:  SettingInfo,
    chatVeryBadWords:  SettingInfo,
    chatFuzzyScoreForVBW:  SettingInfo,
    chatNoticeToUserVBW:  SettingInfo,
    [key: string]: SettingInfo, // variable key
  }

interface SettingInfo {
    defaultValue: unknown, 
    desc: string, 
    fromSettings?: boolean, 
    forceUpdate?: boolean, 
    liveUpdate?: boolean, 
    convert?: unknown,    
}

interface Settings{
    cliBroadcastUserCmd: boolean,
    cliBroadcastStaffCmd: boolean,
    cliBaseStaffCommand: string,
    cliBaseUserCommand: string,
    debugAllowedUsernames: unknown,
    debugEnableRemoteUser: unknown,
    debugAllowOwner:   unknown,
    userStaffMembersAdmin:  unknown,
    userStaffMembersMonitor:  unknown,
    sessionMinTimeBetweenSession:  number,
    sessionMaxTimeToRejoin:  number,
    sessionMaxSessionLength:  number,
    sessionHistoryMaxLength:  number,
    chatBadWords:  string[],
    chatFuzzyScoreForBW:  number,
    chatVeryBadWords:  string[],
    chatFuzzyScoreForVBW:  number,
    chatNoticeToUserVBW:  unknown,
    [key: string]: unknown,
}

interface LiveSettings{
    [key: string]: unknown,
}

/*
    Reminder using $settings:
    Boolean : need to have forceUpdate:true
    String : if not set, empty string. Need forceUpdate:true to get the empty string
    Number : if not set, null. Need forceUpdate:true to get the null value
    Dropdown : if not set, null. Need forceUpdate:true to get the null value. if set, get a String
*/
const SETTINGS_CONVERT = {
    number:         'number',
    listString:     'listString',
    boolean:        'boolean',
};

const SETTINGS_INFO: SettingsInfoObj = {
    cliBroadcastUserCmd:    {
        defaultValue: false, desc: 'Broadcast User command to everyone in chat',
        fromSettings:false, liveUpdate: true, convert:SETTINGS_CONVERT.boolean},
    cliBroadcastStaffCmd:   {
        defaultValue: false, desc: 'Broadcast Amdin command to everyone in chat', 
        fromSettings:false},
    cliBaseStaffCommand:        {
        defaultValue: BASE_STAFF_COMMAND, fromSettings:true, 
        desc: 'Command prefix for Staff commands'},
    cliBaseUserCommand:         {
        defaultValue: BASE_USER_COMMAND, fromSettings:true, 
        desc: 'Command prefix for User commands'},
    debugAllowedUsernames:  {
        defaultValue: [], fromSettings:true, convert: SETTINGS_CONVERT.listString, 
        desc: 'username of the user allowed to use debug commands'},
    debugEnableRemoteUser:  {
        defaultValue: false, fromSettings:true, 
        desc: 'allowing a remote user to use debug commands'},
    debugAllowOwner:  {
        defaultValue: false, fromSettings:true, 
        desc: 'allowing room owner to use debug commands'},
    userStaffMembersAdmin: {
        defaultValue: [], fromSettings:true, convert: SETTINGS_CONVERT.listString, 
        desc: 'staff users allowed to use Staff/privileged commands'},
    userStaffMembersMonitor: {
        defaultValue: [], fromSettings:true, convert: SETTINGS_CONVERT.listString,
        liveUpdate: true,
        desc: 'staff users only allowed monitoring commands'},
    sessionMinTimeBetweenSession: {
        defaultValue: 2 * 60 , fromSettings:true, 
        desc: 'Minimum time between 2 different sessions (default 2h)'},
    sessionMaxTimeToRejoin: {
        defaultValue: 30 , fromSettings:true, 
        desc: 'Maximum time to rejoin a session, to keep same session (default 30min)'},
    sessionMaxSessionLength: {
        defaultValue: 8 * 60 , fromSettings:true, 
        desc: 'How much time a session will last (default 8h)'},
    sessionHistoryMaxLength: {
        defaultValue: 10 , fromSettings:false, 
        desc: 'How many sessions to keep in history'},
    chatBadWords: {
        defaultValue: [], 
        fromSettings:true, convert: SETTINGS_CONVERT.listString,
        liveUpdate: false,
        desc: 'words that will be removed from chat message'},
    chatFuzzyScoreForBW: {
        defaultValue: 60, fromSettings:true, liveUpdate: false,
        desc: 'minimal fuzzy similarity score to consider word is BW, range 0-100, 0 to disable'},
    chatVeryBadWords: {
        defaultValue: [], 
        fromSettings:true, convert: SETTINGS_CONVERT.listString,
        liveUpdate: false,
        desc: 'if chat message contains one of those words, message is spammed'},
    chatFuzzyScoreForVBW: {
        defaultValue: 60, fromSettings:true, liveUpdate: false,
        desc: 'minimal fuzzy similarity score to consider word is VBW, range 0-100, 0 to disable'},
    chatNoticeToUserVBW: {
        defaultValue: 'Be Polite, Please ! No bad words !', 
        fromSettings:true,
        liveUpdate: false,
        desc: 'Notice to send to user using very bad words'},
            
};

function getSettings(): Settings {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const settings: Settings = {};

    Object.entries(SETTINGS_INFO).forEach(([n, sInfo]) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {defaultValue = null, desc = null, fromSettings = null, 
                forceUpdate = null, liveUpdate = null, convert = null} = sInfo;
        const name: keyof typeof SETTINGS_INFO = n;

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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const v = $settings[key];
                    if ( v || forceUpdate) {
                        if (convert && v) {
                            let c = null;
                            let l = null;
                            let nv: unknown = null;
                            switch (convert) {
                                case SETTINGS_CONVERT.number:
                                    c = parseInt(v as string);
                                    if (typeof c === 'number' && c) {
                                        settings[name] = c;
                                    } else {
                                        settings[name] = defaultValue;
                                    }
                                    break;
                                case SETTINGS_CONVERT.listString:
                                    l = (v as string).split(CB_SETTINGS_LIST_SEPARATOR);
                                    nv = [] as string[];
                                    l.forEach(u => {
                                        (nv as string[]).push(u.trim());
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
                }
                catch (ReferenceError) {
                    settings[name] = defaultValue;
                }
            }
            if (liveUpdate) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const liveSettings: Settings = $kv.get(KV_KEYS.liveSettings, {}) as Settings;
                if (Object.hasOwn(liveSettings, name)) {
                    const v = settings[name];
                    const nv = liveSettings[name];
                    if (Array.isArray(v) && Array.isArray(nv)) {
                        settings[name] =  v.concat(nv);
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
    SETTINGS = getSettings()
}

let SETTINGS: Settings = getSettings();
updateSettings();

export {
    SettingInfo, LiveSettings,
    SETTINGS_CONVERT, SETTINGS_INFO, SETTINGS, 
    getSettings, updateSettings
};
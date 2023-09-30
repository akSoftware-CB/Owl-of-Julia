import { CBObjUser, CB_USER_GROUPS } from "./cb/cb-api.mjs";
import { SETTINGS } from "./settings.mjs";


enum CAPABILITY {
    none            = 0,
    debugShow       = 1 << 1,
    debugChange     = 1 << 2,
    settingsShow    = 1 << 3,
    settingsSet     = 1 << 4,
    statShow        = 1 << 5,
    timerAdmin      = 1 << 6,
    timerShow       = 1 << 7,
    cowsay          = 1 << 8,    
}

const DEFAULT_USER_RIGHTS = {
    guru: 0xFFFFFFFF,
    debug: CAPABILITY.debugShow | CAPABILITY.debugChange,
    owner: CAPABILITY.settingsShow | CAPABILITY.settingsSet | CAPABILITY.statShow 
    | CAPABILITY.timerAdmin | CAPABILITY.timerShow 
    | CAPABILITY.cowsay,
    admin:  CAPABILITY.settingsShow | CAPABILITY.settingsSet | CAPABILITY.statShow 
    | CAPABILITY.timerAdmin | CAPABILITY.timerShow 
    | CAPABILITY.cowsay,
    monitor:  CAPABILITY.settingsShow | CAPABILITY.timerShow 
    | CAPABILITY.cowsay,
    user: CAPABILITY.cowsay,
}


function getUserCapabilities(userObj: CBObjUser) {
    const username = userObj.username;

    let capabilities = 0;
    if (SETTINGS.debugEnableRemoteUser 
        && SETTINGS.debugAllowedUsernames 
        && Array.isArray(SETTINGS.debugAllowedUsernames)
        && username && SETTINGS.debugAllowedUsernames.includes(username)) {
        capabilities = capabilities | DEFAULT_USER_RIGHTS.debug;
    }
    if (userObj.colorGroup === CB_USER_GROUPS.owner.userColor || userObj.isOwner) {
        capabilities = capabilities | DEFAULT_USER_RIGHTS.owner;
        if (SETTINGS.debugAllowOwner) {
            capabilities = capabilities | DEFAULT_USER_RIGHTS.debug;
        }
    }

    if (SETTINGS.userStaffMembersAdmin 
        && Array.isArray(SETTINGS.userStaffMembersAdmin) 
        && username && SETTINGS.userStaffMembersAdmin.includes(username)) {
        capabilities = capabilities | DEFAULT_USER_RIGHTS.admin;
    }

    if (SETTINGS.userStaffMembersMonitor 
        && Array.isArray(SETTINGS.userStaffMembersMonitor) 
        && username && SETTINGS.userStaffMembersMonitor.includes(username)) {
        capabilities = capabilities | DEFAULT_USER_RIGHTS.monitor;
    }

    capabilities = capabilities | DEFAULT_USER_RIGHTS.user;
    return capabilities;
}


export {CAPABILITY, getUserCapabilities};

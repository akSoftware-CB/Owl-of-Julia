
import { CB_USER_GROUPS, CBcontext } from "../cb/cb-api.mjs"  

const NOTICE_COLOR_THEME = {
    staff: {    
        color: 'Black',
        bgColor: 'LightSteelBlue',
        fontWeight: 'normal',
    },
    user: {    
        color: 'Black',
        bgColor: 'HotPink',
        fontWeight: 'normal',
    },
    error: {    
        color: 'White',
        bgColor: 'Crimson',
        fontWeight: 'normal',
    },
    userError: {    
        color: 'White',
        bgColor: 'Crimson',
        fontWeight: 'bold',
    },
    help: {    
        color: 'Black',
        bgColor: 'Lavender',
        fontWeight: 'normal',
    },
    timer: {    
        color: 'Black',
        bgColor: 'linear-gradient(to right, rgba(255, 102, 34, 0) 5%, rgba(255, 102, 34, 0.2) 20%, rgba(255, 102, 34, 0.4) 73%, rgba(255, 102, 34, 0.2))',
        fontWeight: 'normal',
    },    
};


function printCommandResult(ctx: CBcontext, message: string, theme = NOTICE_COLOR_THEME.staff) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {user, room, kv = null } = ctx;

    const p = {
        ...theme,
        toUsername: user.username,
    };

    if (typeof room != 'undefined') {
        room.sendNotice(message, p);
    }
}

function printToOwner(ctx: CBcontext, message: string, theme = NOTICE_COLOR_THEME.staff) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {user, room, kv = null } = ctx;

    const p = {
        ...theme,
        toUsername: room.owner,
    };

    if (typeof room != 'undefined') {
        room.sendNotice(message, p);
    }
}

function printToUser(ctx: CBcontext, message: string, username: string, theme = NOTICE_COLOR_THEME.userError) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {user = null, room, kv = null } = ctx;

    const p = {
        ...theme,
        toUsername: username,
    };

    if (typeof room != 'undefined') {
        room.sendNotice(message, p);
    }
}

function printToGroup(ctx: CBcontext, message: string, group = CB_USER_GROUPS.fanclub, theme = NOTICE_COLOR_THEME.user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {user = null, room, kv = null } = ctx;

    const p = {
        ...theme,
        toColorGroup: group.noticeColor,
    };

    if (typeof room != 'undefined') {
        room.sendNotice(message, p);
    }
}

function printToEveryone(ctx: CBcontext, message: string, theme = NOTICE_COLOR_THEME.user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {user = null, room, kv = null } = ctx;

    const p = {
        ...theme,
    };
    
    if (typeof room != 'undefined') {
        room.sendNotice(message, p);
    }
}

export {NOTICE_COLOR_THEME, printToUser, printCommandResult, printToOwner, 
        printToGroup, printToEveryone};

        
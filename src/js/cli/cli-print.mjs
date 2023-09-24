
export const NOTICE_COLOR_THEME = {
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


export function printCommandResult(ctx, message, theme = NOTICE_COLOR_THEME.staff) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {user = null, room = null, kv = null } = ctx;

    const p = {
        ...theme,
        toUsername: user.username,
    };

    room.sendNotice(message, p);
}
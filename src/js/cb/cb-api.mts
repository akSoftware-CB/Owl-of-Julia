

const CB_USER_GROUPS = {
    owner:          {userColor: 'o'},
    moderator:      {userColor: 'm',    noticeColor: 'red'},
    fanclub:        {userColor: 'f',    noticeColor: 'green'},
    darkPurple:     {userColor: 'l',    noticeColor: 'darkpurple'},
    lightPurple:    {userColor: 'p',    noticeColor: 'lightpurple'},
    darkBlue:       {userColor: 'tr',   noticeColor: 'darkblue'},
    lightBlue:      {userColor: 't',    noticeColor: 'lightblue'},
    grey:           {userColor: 'g',    noticeColor: 'red'},
};


interface CBcontext {
    app: CBObjApp,
    callback: CBObjCallback,
    kv: CBObjKV, 
    message: CBObjMessage,     
    room: CBObjRoom, 
    tip: CBObj, 
    user: CBObjUser, 
}

// interface CBSettings {
//     [key: string]: string | boolean | number,
// }

interface CBObjApp {
    name: string,
    version: string,
}

interface CBObjCallback {
    create: cbFunction,
    cancel: cbFunction,
    label: string,
}

interface CBObjKV {
    get: cbFunction,
    set: cbFunction,
    remove: cbFunction,
    clear: cbFunction,
}

interface CBObjMessage {
    setSpam: cbFunction,
    setBody: cbFunction,
    setBgColor: cbFunction,
    setColor: cbFunction,
    setFont: cbFunction,
    orig: string,
}

interface CBObjRoom {
    sendNotice: cbFunction,
    owner: string,
}

interface CBObjUser {
    colorGroup: string,
    isOwner: boolean,
    username: string,
}

interface CBObj {
    get: cbFunction,
    set: cbFunction,
    remove: cbFunction,
    sendNotice: cbFunction,
    [key: string]: unknown | cbFunction,
}

type cbFunction = (..._args: unknown[]) => unknown;


enum CBFonts {
    Default = 'Default', 
    Arial = 'Arial',
    Bookman = 'Bookman Old Style',
    Comic = 'Comic Sans',
    Courier = 'Courier',
    Lucida = 'Lucida',
    Palantino = 'Palantino',
    Tahoma = 'Tahoma',
    Times = 'Times New Roman',
}

// interface Example {
//     func(...args: any[]): void;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function cbFunction(..._args: unknown[]): unknown {
//     return false
// }


// const $settingshelper: CBSettings = {};

// const $kvhelper: CBObj = {
//     //get: (...) => {return null;},
//     get: cbFunction,
// }

export {CBFonts, CBcontext, CB_USER_GROUPS, CBObjUser};

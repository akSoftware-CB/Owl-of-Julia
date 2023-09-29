
import { getRandomID } from "../tool/tool.mjs";
import { CBcontext } from "../cb/cb-api.mjs";
import { NOTICE_COLOR_THEME, printCommandResult } from "../cli/cli-print.mjs";
import { logIt } from "../tool/log.mjs";
import { CAPABILITY } from "../user-management.mjs";
import { CommandInfoStore, extendAvaillableStaffCommands, extendAvaillableUserCommands } from "./command-processor.mjs";


const AVAILABLE_STAFF_COMMANDS: CommandInfoStore = [
    { name: 'test', subCommand: 'perfkv', capabilities: CAPABILITY.debugChange, 
    func: testPerfKV, help: 'some KV perf testing' },

    { name: 'test', subCommand: 'getID', capabilities: CAPABILITY.debugChange, 
    func: testRandomID, help: 'testing ID generation' },
    // { name: 'test', subCommand: 'testExtend', capabilities: CAPABILITY.debugChange, 
    // func: testExtendClass, help: 'test JS extend classes' },
];

const AVAILABLE_USER_COMMANDS = [
    { name: 'test', subCommand: 'testForEveryone', capabilities: 0, 
    func: testSimpleCommand, help: 'Want to test an app command ?' },
];

export function init() {
    extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS);
    extendAvaillableUserCommands(AVAILABLE_USER_COMMANDS);
}

export function testRandomID(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv = null } = ctx;

    let m = getRandomID();
    printCommandResult(ctx,m, NOTICE_COLOR_THEME.staff);
    m = getRandomID(4);
    printCommandResult(ctx,m, NOTICE_COLOR_THEME.staff);
    m = getRandomID(8);
    printCommandResult(ctx,m, NOTICE_COLOR_THEME.staff);
}

function testSimpleCommand(ctx: CBcontext) {
    printCommandResult(ctx, 'Good you can run a command :-)', NOTICE_COLOR_THEME.help);
}

interface TestToto {
    tete: number,
    l: number[]
}

function testPerfKV(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, user = null, room = null, kv } = ctx;
    logIt("testing KV perf");

    const origBody = message.orig.trim().toLowerCase();

    const elements = origBody.split(' ');
    const action = elements[3];

    if ('init' === action) {
        const toto: TestToto = { tete: 0, l: []};
        kv.set('toto', toto);    
    } else if ('display' === action) {
        const t: TestToto = kv.get('toto', {}) as TestToto;
        logIt(t.tete)
        let s = 0;
        t.l.forEach(e => {
            s = s + e;
        });
        logIt(s);    
    } else {
        const iter = parseInt(action);
        let t: TestToto = {} as TestToto;
        t = kv.get('toto', {}) as TestToto;
    
        for (let index = 0; index < iter; index++) {
            t = kv.get('toto', {}) as TestToto;
            t.tete = t.tete + 1;
            t.l.push(t.tete);
            kv.set('toto', t);   
        }
    }
}

import { CBcontext } from "../cb/cb-api.mjs";
import { NOTICE_COLOR_THEME, printCommandResult } from "../cli/cli-print.mjs";
import { COMMAND_START_CHAR } from "../defaults.mjs";
import { SETTINGS } from "../settings.mjs";
import { CAPABILITY, getUserCapabilities } from "../user-management.mjs";
import { init as initCmdDebug } from "./command-debug.mjs";
import { init as initCmdHelp } from "./command-help.mjs";
import { init as initCmdSetting } from "./command-setting.mjs";
import { init as initCmdStat } from "./command-stat.mjs";
import { init as initCmdTest} from "./command-test.mjs";
import { init as initCmdTimer } from "./command-timer.mjs";


function createCommandsList() {
    initCmdTest();
    initCmdDebug();
    initCmdSetting();
    initCmdStat();
    initCmdTimer();
    initCmdHelp();    
}

// yes, staff, ajajaj better than admin, god, mods, or anything else
const AVAILABLE_STAFF_COMMANDS: CommandInfoStore = [];
const AVAILABLE_USER_COMMANDS: CommandInfoStore = [];


interface CommandInfo {
    name:           string,
    subCommand?:     string,
    capabilities:   CAPABILITY, 
    func:           CliCommandFunction,
    help:           string,
}

type CommandInfoStore = CommandInfo[];

type CliCommandFunction = (ctx: CBcontext, args: Args, cliInfo: CliInfo) => unknown;

type Args = string[];

interface CliInfo {
    commandName: string,
    subCommand: string,
}

function extendAvaillableStaffCommands(commandList: CommandInfoStore) {
    commandList.forEach(command => {
        AVAILABLE_STAFF_COMMANDS.push(command);
    });
    console.log(AVAILABLE_STAFF_COMMANDS);
}

function extendAvaillableUserCommands(commandList: CommandInfoStore) {
    commandList.forEach(command => {
        AVAILABLE_USER_COMMANDS.push(command);
    });
}


function commandProcessor(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, user, room = null, kv = null } = ctx;
    const userCap = getUserCapabilities(user);

    function loopOnAvailableCommands(availableCommands: CommandInfoStore, origBody: string) {
        const elements = origBody.split(' ');
        const commandName = elements[1];
        const subCommand = elements[2];

        let cmdFound = false;
        availableCommands.forEach(c => {
            if (c.name === commandName && ((c.capabilities & userCap) === c.capabilities)) {
                if ((c.subCommand === undefined) || (c.subCommand === subCommand)) {
                    let args = [];
                    const cliInfo: CliInfo = {
                        commandName: commandName,
                        subCommand: null as unknown as string,
                    };
                    if (c.subCommand === undefined) {
                        args = elements.slice(2);
                    } else {
                        args = elements.slice(3);
                        cliInfo.subCommand = c.subCommand;
                    }
                    cmdFound = true ;
                    c.func(ctx, args, cliInfo);    
                }
            }
        });
        
        if (!cmdFound) {
            printCommandResult(ctx, 'Command not found !', NOTICE_COLOR_THEME.error);
        }
    }

    const origBody = message.orig.trim();
    if (origBody[0] === COMMAND_START_CHAR) {
        createCommandsList();
        if (origBody.startsWith(SETTINGS.cliBaseStaffCommand)) {
            loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS, origBody);

        } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand)) {
            loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, origBody);

        }    
    }
}


export {
    AVAILABLE_STAFF_COMMANDS, AVAILABLE_USER_COMMANDS, 
    CommandInfoStore, Args, CliInfo, CliCommandFunction, 
    commandProcessor, 
    extendAvaillableStaffCommands,
    extendAvaillableUserCommands
};

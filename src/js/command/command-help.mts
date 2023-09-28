import { CBcontext } from "../cb/cb-api.mjs";
import { printCommandResult, NOTICE_COLOR_THEME } from "../cli/cli-print.mjs";
import { SETTINGS } from "../settings.mjs";
import { getUserCapabilities } from "../user-management.mjs";
import { AVAILABLE_STAFF_COMMANDS, AVAILABLE_USER_COMMANDS, CommandInfoStore, extendAvaillableStaffCommands, extendAvaillableUserCommands } from "./command-processor.mjs";

const LOCAL_AVAILABLE_STAFF_COMMANDS: CommandInfoStore = [
    { name: 'help', capabilities: 0, func: cliHelpShowHelp, help: 'Need Help ?' },
];

const LOCAL_AVAILABLE_USER_COMMANDS: CommandInfoStore = [
    { name: 'help', capabilities: 0, func: cliHelpShowHelp, help: 'Need Help ?' },
];

export function init() {
    extendAvaillableStaffCommands(LOCAL_AVAILABLE_STAFF_COMMANDS);
    extendAvaillableUserCommands(LOCAL_AVAILABLE_USER_COMMANDS);    
}

function cliHelpShowHelp(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, room = null, kv = null } = ctx;
    const userCap = getUserCapabilities(user);

    function loopOnAvailableCommands(availableCommands: CommandInfoStore, baseCmd: string) {
        let message = '';
        availableCommands.forEach(c => {
            if ((c.capabilities & userCap) === c.capabilities) {
                if (c.subCommand === undefined) {
                    message = `${message} ${baseCmd} ${c.name} \t -> ${c.help} \n`
    
                } else {
                    message = `${message} ${baseCmd} ${c.name} ${c.subCommand} \t -> ${c.help} \n`
                }    
            }
        }); 
        return message;
    }

    let message = 'Here the commands availlable to you:\n'
    message = message + loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS, SETTINGS.cliBaseStaffCommand);
    message = message + loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, SETTINGS.cliBaseUserCommand);
    printCommandResult(ctx, message, NOTICE_COLOR_THEME.help); 
}


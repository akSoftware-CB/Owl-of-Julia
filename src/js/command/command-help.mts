import { CBcontext } from "../cb/cb-api.mjs";
import { printCommandResult, NOTICE_COLOR_THEME } from "../cli/cli-print.mjs";
import { SETTINGS } from "../settings.mjs";
import { SPACE_NON_SECABLE } from "../tool/tool.mjs";
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
    const { user, message} = ctx;
    const userCap = getUserCapabilities(user);

    function loopOnAvailableCommands(availableCommands: CommandInfoStore, baseCmd: string) {
        let message = '';
        const arrow = `${SPACE_NON_SECABLE}${SPACE_NON_SECABLE}➡${SPACE_NON_SECABLE}${SPACE_NON_SECABLE}`
        availableCommands.forEach(c => {
            if ((c.capabilities & userCap) === c.capabilities) {
                if (c.subCommand === undefined) {
                    message = `${message} ${baseCmd} ${c.name} ${arrow} ${c.help} \n`
    
                } else {
                    message = `${message} ${baseCmd} ${c.name} ${c.subCommand} ${arrow} ${c.help} \n`
                }    
            }
        }); 
        return message;
    }
    
    const origBody = message.orig.trim();
    let resultMessage = 'Here the commands availlable to you:\n'
    if (origBody.startsWith(SETTINGS.cliBaseStaffCommand)) {
        resultMessage = resultMessage + loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS, SETTINGS.cliBaseStaffCommand);
    } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand)) {
        resultMessage = resultMessage + loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, SETTINGS.cliBaseUserCommand);
    } else {
        resultMessage = resultMessage + 'No luck, No commands for you';
    }
    printCommandResult(ctx, resultMessage, NOTICE_COLOR_THEME.help); 
}


import { ModuleChatFilter } from "../app-module/ModuleChatFilter.mjs";
import { CBcontext } from "../cb/cb-api.mjs";
import { CAPABILITY } from "../user-management.mjs";
import { Args, CommandInfoStore, extendAvaillableUserCommands } from "./command-processor.mjs";


const AVAILABLE_USER_COMMANDS: CommandInfoStore = [
    { name: 'cowsay', capabilities: CAPABILITY.cowsay, transform: true,
    func: cliCowSay, help: 'A cow in a chatroom...' },    
];
export function init() {
    extendAvaillableUserCommands(AVAILABLE_USER_COMMANDS);
}


function cliCowSay(ctx: CBcontext, args: Args) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv = null } = ctx;

    let messageText = '';
    if (args.length >= 1) {
        messageText = args.join(' ');
    }
    const chatFilter: ModuleChatFilter = ModuleChatFilter.getFromKV(ctx) as ModuleChatFilter;
    chatFilter.chatCowSay(ctx, messageText);
    chatFilter.storeToKV(ctx);
            
}



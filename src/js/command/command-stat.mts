import { GlobalStatsCompute } from "../app-module/GlobalStatsCompute.mjs";
import { CBcontext } from "../cb/cb-api.mjs";
import { printCommandResult, NOTICE_COLOR_THEME } from "../cli/cli-print.mjs";
import { CAPABILITY } from "../user-management.mjs";
import { CommandInfoStore, extendAvaillableStaffCommands } from "./command-processor.mjs";


const AVAILABLE_STAFF_COMMANDS: CommandInfoStore = [
    { name: 'stat', subCommand: 'showTips', capabilities: CAPABILITY.statShow, 
    func: cliStatShowTipStats, help: 'show Stats about tips' },    
];
export function init() {
    extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS);
}


function cliStatShowTipStats(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv = null } = ctx;

    const statCompute = new GlobalStatsCompute(ctx);
    const p5min = 5 * 60 *1000;
    const bt5min =      statCompute.getMaxTipper(p5min);
    const tot5min0tk =  statCompute.getTotalTips(p5min, 0);
    const tot5min5tk =  statCompute.getTotalTips(p5min, 5);
    const totSession = statCompute.getSessionTotalTips(ctx);

    const msg = `Some Stats:
    - Best Tipper in last 5 minutes: ${bt5min.userName} (${bt5min.tokens} tokens)
    - Total Tips  in last 5 minutes:     ${tot5min0tk.tokens} (${tot5min0tk.userCount} users)
    - Total Big Tips  in last 5 minutes: ${tot5min5tk.tokens} (${tot5min5tk.userCount} users)
    - Total Tips in current Session: ${totSession.tokens} (${totSession.userCount} users)`

    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
}



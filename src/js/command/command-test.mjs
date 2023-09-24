
import { printCommandResult, NOTICE_COLOR_THEME } from "../cli/cli-print.mjs";
import { getRandomID } from "../tool/tool.mjs";

export function testRandomID(ctx) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv = null } = ctx;

    let m = getRandomID();
    printCommandResult(ctx,m, NOTICE_COLOR_THEME.staff);
    m = getRandomID(4);
    printCommandResult(ctx,m, NOTICE_COLOR_THEME.staff);
    m = getRandomID(8);
    printCommandResult(ctx,m, NOTICE_COLOR_THEME.staff);
}


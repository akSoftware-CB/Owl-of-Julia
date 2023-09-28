import { CBcontext } from "./cb/cb-api.mjs";
import { KV_KEYS } from "./tool/kv.mjs";
import { GlobalStatsTimeSeries, TS_TYPES } from "./app-module/GlobalStatsTimeSeries.mjs";
import { UserTipInfo, ExtendedTip } from "./app-module/UserTipInfo.mjs";
import { KeyMap } from "./tool/tool.mjs";

function tipUpdateStatData(ctx: CBcontext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message = null, user = null, room = null, kv, tip = null } = ctx;

    const globalTipStat = GlobalStatsTimeSeries.getFromKV(ctx);
    const currentDate = Date.now();

    globalTipStat.slideAllTimeSeries(currentDate, TS_TYPES.userTips);

    const keysMap: KeyMap = kv.get(KV_KEYS.userTipsKeysMap, {}) as KeyMap;
    const keyList = Object.keys(keysMap);
    keyList.forEach(userName => {
        const userTipInfo = UserTipInfo.getFromKV(ctx, userName);

        let extendedTip: ExtendedTip | undefined = {} as ExtendedTip;
        while (typeof (extendedTip = userTipInfo.tipList.shift()) !== "undefined") {
            globalTipStat.processTip(userName, extendedTip);
        }
        userTipInfo.storeToKV(ctx);
    });
    globalTipStat.storeToKV(ctx);
}

export {tipUpdateStatData};
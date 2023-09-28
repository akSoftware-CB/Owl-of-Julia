import { CBcontext } from "../cb/cb-api.mjs";
import { Session } from "../session-management.mjs";
import { SessionID } from "../tool/tool.mjs";
import { GlobalStatsTimeSeries, TS_METADATA, TS_TYPES } from "./GlobalStatsTimeSeries.mjs";
import { UserTipInfo } from "./UserTipInfo.mjs";


class GlobalStatsCompute {
    sessionID: SessionID;
    globalStatsTS: GlobalStatsTimeSeries;

    constructor(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv = null, tip = null } = ctx;

        const sObj = Session.getCurrentSession(ctx);
        this.sessionID = sObj.sessionID;
        this.globalStatsTS = GlobalStatsTimeSeries.getFromKV(ctx);
    }

    static TIME_RANGE = {
        ALL: 0,
        min5: 5 * 60 * 1000,
        min15: 15 * 60 * 1000,
    };

    getTipSum(tsType: TS_TYPES, tsName: string, period: number) {
        const list = this.globalStatsTS.getTimeSerie(tsType, tsName);
        const span = this.globalStatsTS.getTimeSerieSpan(tsType, tsName);
        const currentDate = Date.now();
        const refDate = this.globalStatsTS.getTimeSerieMetadata(
            tsType,
            tsName,
            TS_METADATA.refDate,
            0);

        let sum = 0;
        if (refDate <= currentDate) {
            this.globalStatsTS.slideAllTimeSeries(currentDate, tsType);
        }
        if (period >= span) {
            const idxStart = Math.floor((refDate - currentDate) / span);
            const idxEnd = idxStart + Math.floor(period / span);
            for (let index = idxStart; index < idxEnd; index++) {
                sum = sum + list[index];
            }
        }
        return sum;
    }

    getMaxTipper(period: number) {
        const tsType = TS_TYPES.userTips;
        const userNames = this.globalStatsTS.getTimeSerieNames(tsType);

        let max = 0;
        let uName = null;
        userNames.forEach(tsName => {
            const sum = this.getTipSum(tsType, tsName, period);
            if (sum > max) {
                max = sum;
                uName = tsName;
            }
        });
        return { userName: uName, tokens: max };
    }

    getTotalTips(period: number, minTipsToAccount = 0) {
        const tsType = TS_TYPES.userTips;
        const userNames = this.globalStatsTS.getTimeSerieNames(tsType);

        let total = 0;
        let userCount = 0;
        userNames.forEach(tsName => {
            const sum = this.getTipSum(tsType, tsName, period);
            if (sum > minTipsToAccount) {
                total = total + sum;
                userCount = userCount + 1;
            }
        });
        return { tokens: total, userCount: userCount };
    }

    getSessionTotalTips(ctx: CBcontext) {
        const tsType = TS_TYPES.userTips;
        const userNames = this.globalStatsTS.getTimeSerieNames(tsType);

        let total = 0;
        let userCount = 0;
        userNames.forEach(tsName => {
            const tipInfo = UserTipInfo.getFromKV(ctx, tsName);
            if (tipInfo.tipTotal > 0) {
                total = total + tipInfo.tipTotal;
                userCount = userCount + 1;
            }
        });
        return { tokens: total, userCount: userCount };
    }
}

export {GlobalStatsCompute};
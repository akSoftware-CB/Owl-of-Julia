
import { CBcontext } from "../cb/cb-api.mjs";
import { Session } from "../session-management.mjs";
import { KV_KEYS } from "../tool/kv.mjs";
import { EpochMs, SessionID, getObjectProperty } from "../tool/tool.mjs";
import { ExtendedTip } from "./UserTipInfo.mjs";


interface TS_TimeSerie {
    [key: string]: number[];
}

interface TS_TimeSerieStore {
    [key: string]: TS_TimeSerie;
}


enum TS_TYPES {
    userTips    = 'userTips',
    message     = 'message',
}

enum TS_METADATA {
    refDate     = 'refDate',
    maxDate     = 'maxDate',
    size        = 'size',
    span        = 'span',
}

class GlobalStatsTimeSeries {
    sessionID: SessionID;
    timeSeries: TS_TimeSerieStore;
    tsMetadata: object;

    constructor(ctx: CBcontext){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        const sObj = Session.getCurrentSession(ctx);
        this.sessionID = sObj.sessionID;
        this.timeSeries= {};
        this.tsMetadata = {};
    }

 
    static TS_TYPES: TS_TYPES;
    static TS_METADATA: TS_METADATA;

    static DEFAULT_TS_METADATA = {
        userTips:       {
            size:   300,
            span:   60000,
        },
        message:    {
            size:   300,
            span:   60000,
        },
    };

    static FALLBACK_TS_SIZE = 300;   // number of buckets in TS
    static FALLBACK_TS_SPAN = 60000; // duration of "bucket" in TS



    static getFromKV(ctx: CBcontext) {
        const globalTipStat = new GlobalStatsTimeSeries(ctx);
        globalTipStat.loadFromKV(ctx);
        return globalTipStat;
    }

    static initNewStatObj(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;
    
        kv.remove(KV_KEYS.currentGlobalStatsTS);
        const globalStatsTS = new GlobalStatsTimeSeries(ctx);
        globalStatsTS.storeToKV(ctx);
        
        return globalStatsTS;
    }

    loadFromKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;

        const globalTipStat: GlobalStatsTimeSeries = kv.get(KV_KEYS.currentGlobalStatsTS, null) as GlobalStatsTimeSeries;
        if (globalTipStat) {
            this.timeSeries = globalTipStat.timeSeries;
            this.tsMetadata = globalTipStat.tsMetadata;
        }
    }    

    storeToKV(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user = null, room = null, kv, tip = null } = ctx;
        kv.set(KV_KEYS.currentGlobalStatsTS, this);
    }

    getTimeSerieNames(tsType: TS_TYPES) {
        const allTS = getObjectProperty(this.timeSeries, tsType, {});

        return Object.keys(allTS);
    }

    getTimeSerie(tsType: TS_TYPES, tsName: string) {
        const allTS = getObjectProperty(this.timeSeries, tsType, {});

        if (Object.hasOwn(allTS, tsName)) {
            return allTS[tsName];
        } else {
            return this.initTimeSerie(tsType, tsName);
        }
    }
    
    initTimeSerie(tsType: TS_TYPES, tsName: string) {
        const allTS = getObjectProperty(this.timeSeries, tsType, {});

        const nbucket = this.getTimeSerieSize(tsType, tsName);
        const list = new Array(nbucket) ;
        list.fill(0);
        allTS[tsName] = list;

        // we want to align all refDate for a given tsType
        let newRefDate = 0;
        let trd = 0;
        const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
        Object.keys(allTSmetadata).forEach(tsName => {
            trd = this.getTimeSerieMetadata(
                tsType, 
                tsName, 
                TS_METADATA.refDate, 
                0);
            if (trd > newRefDate) {
                newRefDate = trd;
            }
        });
        if (newRefDate === 0) {
            const span = this.getTimeSerieSpan(tsType, tsName);            
            newRefDate = Date.now() + span;
        }

        this.setTimeSerieMetadata(
            tsType, 
            tsName, 
            TS_METADATA.refDate, 
            newRefDate);

        return list;
    }

    getTimeSerieSize(tsType: TS_TYPES, tsName: string) {
        return this.getTimeSerieMetadata(
            tsType, 
            tsName, 
            TS_METADATA.size, 
            GlobalStatsTimeSeries.FALLBACK_TS_SIZE);
    }

    getTimeSerieSpan(tsType: TS_TYPES, tsName: string) {
        return this.getTimeSerieMetadata(
            tsType, 
            tsName, 
            TS_METADATA.span, 
            GlobalStatsTimeSeries.FALLBACK_TS_SPAN);
    }

    getTimeSerieMetadata(tsType: TS_TYPES, tsName: string, metadataType: TS_METADATA, fallbackValue: unknown) {
        const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
        const metadataObj =  getObjectProperty(allTSmetadata, tsName, {});        

        const typeDefaultValues = getObjectProperty(
            GlobalStatsTimeSeries.DEFAULT_TS_METADATA, 
            tsType, 
            {}, 
            false);
        const defaultValue = getObjectProperty(typeDefaultValues, metadataType, fallbackValue, false);
        
        const metadata = getObjectProperty(
            metadataObj, 
            metadataType, 
            defaultValue
            );

        return metadata;
    }

    setTimeSerieMetadata(tsType: TS_TYPES, tsName: string, metadataType: TS_METADATA, newValue: unknown) {
        const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
        const metadataObj =  getObjectProperty(allTSmetadata, tsName, {});        
        
        metadataObj[metadataType] = newValue;
    }

    slideAllTimeSeries(currentDate: EpochMs, tsType: TS_TYPES) {
        const allTS = getObjectProperty(this.timeSeries, tsType, {})

        Object.keys(allTS).forEach(tsName => {                  
            this.slideTimeSeries(currentDate, tsType, tsName);
        });
    }

    slideTimeSeries(currentDate: EpochMs, tsType: TS_TYPES, tsName: string) {
        const refDate = this.getTimeSerieMetadata(
            tsType, 
            tsName, 
            TS_METADATA.refDate, 
            0);

        const span = this.getTimeSerieSpan(tsType, tsName);

        if (refDate === 0) {
            this.setTimeSerieMetadata(
                tsType, 
                tsName, 
                TS_METADATA.refDate, 
                currentDate + span);
        } else if (currentDate - refDate >= 0 ) {
            const nbucket = Math.ceil((currentDate - refDate) / span);
            const allTS: TS_TimeSerie = getObjectProperty(this.timeSeries, tsType, {})

            Object.values(allTS).forEach((list) => {                  
                for (let i = 0; i < nbucket; i++) {
                    list.unshift(0);
                    list.pop();
                }
            });
            this.setTimeSerieMetadata(
                tsType, 
                tsName, 
                TS_METADATA.refDate, 
                refDate + (nbucket * span));
        }
    }


    processTip(userName: string, tip: ExtendedTip) {
        const tsType = TS_TYPES.userTips;
        const span = this.getTimeSerieSpan(tsType, userName);

        const list = this.getTimeSerie(tsType, userName);
        const refDate = this.getTimeSerieMetadata(
            tsType, 
            userName, 
            TS_METADATA.refDate, 
            0);
        const maxDate = this.getTimeSerieMetadata(
            tsType, 
            userName, 
            TS_METADATA.maxDate, 
            0);
    
        if (tip.date > maxDate) {
            const idx = Math.floor((refDate - tip.date) / span);
        
            list[idx] = list[idx] + tip.tokens;     
            this.setTimeSerieMetadata(
                tsType, 
                userName, 
                TS_METADATA.maxDate, 
                tip.date);
        } 
    }

}

export {GlobalStatsTimeSeries, TS_TYPES, TS_METADATA};
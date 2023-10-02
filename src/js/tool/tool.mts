
const SPACE_NON_SECABLE = '\u00A0';

type EpochMs = number;

type GenericID = string;
type SessionID = GenericID;

function getRandomInt(min: number, max: number) {
    const tMin = Math.ceil(min);
    const tMax = Math.floor(max);
    return Math.floor(Math.random() * (tMax - tMin) + tMin); // The maximum is exclusive and the minimum is inclusive
}
  
function getRandomID(strengh = 2): GenericID {
    const il: number[] = [];
    for (let index = 0; index < strengh; index++) {
        il.push(getRandomInt(0, 0x100000));
    }    

    let id = '';
    il.forEach(element => {
        id = id + element.toString(16);
    });

    return id;
}

function getObjectProperty(obj: object, prop: string, defaultValue: unknown = null, updateObject = true) {
    if (Object.hasOwn(obj, prop)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return obj[prop];
    } else {
        if (updateObject) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            obj[prop] = defaultValue;
        }
        return defaultValue;
    }
}

interface KeyMap {
    [key: string]: GenericID;
}

export {
    EpochMs, SessionID, GenericID, KeyMap,
    SPACE_NON_SECABLE,
    getRandomID, getObjectProperty, 
};

import { CBFonts, CBcontext } from "../cb/cb-api.mjs";
import { SETTINGS } from "../settings.mjs";
import { ModuleBase } from "./ModuleBase.mjs";
import { UserChatInfo } from "./UserChatInfo.mjs";
import { cowsay } from "cowsayjs";

interface FilterResult {
    badWords: string[],
    veryBadWords: string[],
    spam: boolean,
}

interface LeetTable {
    [key: string]: string[],
}

const LEET_TABLE: LeetTable = {
    a: ['@', '4'],
    b: ['8'],
    c: ['('],
    e: ['3'],
    g: ['6'],
    h: ['#'],
    i: ['!', '1'],
    l: ['1'],
    o: ['0'],
    s: ['$'],
    t: ['7'],
    z: ['2'],
};

function leetChar(chr: string) {
    let rl = [];
    if (Object.hasOwn(LEET_TABLE, chr.toLowerCase())) {
        rl.push(chr);
        rl = rl.concat(LEET_TABLE[chr.toLowerCase()]);                
    } else {
        rl.push(chr);
    }
    return rl;
}

function leetString(str: string) {
    const rl: string[] = [];
    if (str.length > 1) {
        leetChar(str[0]).forEach(e1 => {
            leetString(str.substring(1)).forEach(e2 => {
                rl.push(e1.concat(e2));
            })
        });
    } if (str.length === 1) {
        leetChar(str[0]).forEach(e1 => {
            rl.push(e1);
        });
    } else {
        rl.push(str);
    }
    return rl;
}


function stringSimilarity(str1: string, str2: string, gramSize = 3) {
    function getNGrams(s: string, len: number): string[] {
        s = ' '.repeat(len - 1) + s.toLowerCase() + ' '.repeat(len - 1);
        const v: string[] = new Array(s.length - len + 1);
        for (let i = 0; i < v.length; i++) {
            v[i] = s.slice(i, i + len);
        }
        return v;
    }
    if (!(str1 === null || str1 === void 0 ? void 0 : str1.length) || !(str2 === null || str2 === void 0 ? void 0 : str2.length)) {
        return 0.0;
    }
    const s1 = str1.length < str2.length ? str1 : str2;
    const s2 = str1.length < str2.length ? str2 : str1;
    const pairs1 = getNGrams(s1, gramSize);
    const pairs2 = getNGrams(s2, gramSize);
    const set = new Set(pairs1);
    const total = pairs2.length;
    let hits = 0;
    // eslint-disable-next-line prefer-const
    for (let item of pairs2) {
        if (set.delete(item)) {
            hits++;
        }
    }
    return hits * 100 / total;
}

function compareWord(
    word: string, 
    badWord: string, 
    collator: Intl.Collator, 
    fuzzyScoreMin: number
    ) {
    if (collator.compare(word, badWord) === 0) {
        return badWord;
    }
    
    const bwl = leetString(badWord);
    bwl.forEach(ebw => {
        if (collator.compare(word, ebw) === 0) {
            return ebw;
        }                         
    });

    let found = false;
    found = bwl.some(ebw => {
        if (collator.compare(word, ebw) === 0) {
            return ebw;
        } else {
            return false;
        }                        
    });
    if (found) {
        return found;
    }

    if (fuzzyScoreMin > 0) {
        if (stringSimilarity(badWord, word) > fuzzyScoreMin) {
            return badWord;
        }

        found = false;
        found = bwl.some(ebw => {
            if (stringSimilarity(ebw, word) > fuzzyScoreMin) {
                return ebw;
            } else {
                return false;
            }                        
        });
        if (found) {
            return found;
        }
    }

    return false;
}

function searchBadWord(wordsList: string[], badWordList: string[], fuzzyScoreMin: number) {
    const collator = Intl.Collator('en-US', { sensitivity: 'base' });
    const foundBadWords: string[] = [];
    let found = false;
    wordsList.forEach(word => {
        found = false;
        found = badWordList.some(bw => {
            return compareWord(word, bw, collator, fuzzyScoreMin);
        });

        if (found) {
            foundBadWords.push(word);
        }
    });
    return foundBadWords;
}

function splitMessageText(messageText: string) {
    let wordRegexString = '([a-zA-Zà-üÀ-Ü'
    Object.values(LEET_TABLE).forEach(l => {
        l.forEach(c => {
            wordRegexString = wordRegexString.concat(c);
        })
    });
    wordRegexString = wordRegexString.concat('])+');

    let wordRegex = /([a-zA-Zà-üÀ-Ü])+/g;
    wordRegex = new RegExp(wordRegexString, "g");
    const words: string[] = messageText.match(wordRegex) as string[];
    return words;
}

class ModuleChatFilter extends ModuleBase {

    onMessage(ctx: CBcontext) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message = null, user, kv = null } = ctx;

        const userName = user.username;
        UserChatInfo.sendPendingNotices(ctx, userName);

    }

    onMessageTransform(ctx: CBcontext): FilterResult {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message, user, kv = null } = ctx;

        const words: string[] = splitMessageText(message.orig);
        let newMessage = message.orig;
        let foundBadWords: string[] = [];
        const result: FilterResult = {
            badWords: [],
            veryBadWords: [],
            spam: false,
        };
        foundBadWords = searchBadWord(words, SETTINGS.chatBadWords, SETTINGS.chatFuzzyScoreForBW);
        if (foundBadWords.length > 0) {
            foundBadWords.forEach(bw => {
                let newWord = bw.slice(0, 1);
                newWord = newWord.padEnd(bw.length, '.');
                newMessage = newMessage.replaceAll(bw, newWord);
                message.setBody(newMessage);
                result.badWords = foundBadWords as string[];
                result.spam = true;
            });
        }
        foundBadWords = searchBadWord(words, SETTINGS.chatVeryBadWords, SETTINGS.chatFuzzyScoreForVBW);
        if (foundBadWords.length > 0) {
            message.setSpam(true);
            const n = user.username + ' ' + SETTINGS.chatNoticeToUserVBW;
            UserChatInfo.addPendingNotice(ctx, user.username, n);
            result.badWords = foundBadWords;
            result.spam = true;
        }
        return result;
    }

    chatCowSay(ctx: CBcontext, messageText: string) {
        const { message } = ctx;

        let spam = false;
        if (messageText.length > 0) {
            const words: string[] = splitMessageText(messageText);
            let foundBadWords: string[] = [];
            foundBadWords = searchBadWord(words, SETTINGS.chatBadWords, SETTINGS.chatFuzzyScoreForBW);
            if (foundBadWords.length > 0) {
                spam = true;
            } else {
                foundBadWords = searchBadWord(words, SETTINGS.chatVeryBadWords, SETTINGS.chatFuzzyScoreForVBW);
                if (foundBadWords.length > 0) {
                    spam = true;
                }            
            }    
        }
        
        if (!spam) {
            const newMessage: string = '\n' + cowsay(messageText, {cow: SETTINGS.cowsayCowName}).replaceAll(' ','\u00A0');
            message.setBody(newMessage);
            message.setFont(CBFonts.Courier);
            message.setColor(SETTINGS.cowsayColor);
            message.setBgColor(SETTINGS.cowsayBgColor);
            message.setSpam(false);
        }
    }
}


export {FilterResult, ModuleChatFilter} ;
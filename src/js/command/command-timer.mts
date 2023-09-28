import { ModuleTimer, TIMER_STATUS } from "../app-module/ModuleTimer.mjs";
import { CBcontext } from "../cb/cb-api.mjs";
import { NOTICE_COLOR_THEME, printCommandResult } from "../cli/cli-print.mjs";
import { AVAILLABLE_LIVE_SETTINGS_NAMES, COMMAND_START_CHAR } from "../defaults.mjs";
import { SETTINGS } from "../settings.mjs";
import { CAPABILITY } from "../user-management.mjs";
import { Args, CliInfo, CommandInfoStore, extendAvaillableStaffCommands } from "./command-processor.mjs";


const AVAILABLE_STAFF_COMMANDS: CommandInfoStore = [
    { name: 'timer', subCommand: 'start', capabilities: CAPABILITY.timerAdmin, 
    func: cliTimerStart, help: 'Start timer' },    
    { name: 'timer', subCommand: 'stop', capabilities: CAPABILITY.timerAdmin, 
    func: cliTimerStop, help: 'Stop timer' },    
    { name: 'timer', subCommand: 'stopall', capabilities: CAPABILITY.timerAdmin, 
    func: cliTimerStopAll, help: 'Stop All timers' },    
    { name: 'timer', subCommand: 'freeze', capabilities: CAPABILITY.timerAdmin, 
    func: cliTimerFreeze, help: 'Freeze timer' },    
    { name: 'timer', subCommand: 'list', capabilities: CAPABILITY.timerShow, 
    func: cliTimerListTimers, help: 'List timers' },   
    { name: 'timer', subCommand: 'add', capabilities: CAPABILITY.timerAdmin, 
    func: cliTimerAddTimer, help: 'Add a timer' },   
    { name: 'timer', subCommand: 'delete', capabilities: CAPABILITY.timerAdmin, 
    func: cliTimerdeleteTimer, help: 'delete a timer' },   

];
export function init() {
    extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS);
}


function cliTimerStart(ctx: CBcontext, args: Args, cliInfo: CliInfo) {

    if (args.length === 1) {
        const moduleTimer: ModuleTimer = ModuleTimer.getFromKV(ctx) as ModuleTimer;
        const name = args[0];
        const result = moduleTimer.startTimer(ctx, name);
        if (result.status === TIMER_STATUS.running) {
            moduleTimer.storeToKV(ctx);
            console.log(moduleTimer);
            printCommandResult(ctx, 'Timer started: ' + name, NOTICE_COLOR_THEME.staff);        
        } else if (result.status === TIMER_STATUS.unknown) {
            printCommandResult(ctx, 'Timer unknown: ' + name, NOTICE_COLOR_THEME.error);        
        } else {
            printCommandResult(ctx, 'Timer, unknown error: ' + name, NOTICE_COLOR_THEME.error);    
        }
    } else {
        const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${SETTINGS.cliBaseStaffCommand} ${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`
        printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);    
    }
}

function cliTimerFreeze(ctx: CBcontext, args: Args, cliInfo: CliInfo) {

    if (args.length === 1) {
        const moduleTImer: ModuleTimer = ModuleTimer.getFromKV(ctx) as ModuleTimer;
        const name = args[0];
        const result = moduleTImer.freezeTimer(ctx, name);
        if (result.status === TIMER_STATUS.frozen) {
            moduleTImer.storeToKV(ctx);
            printCommandResult(ctx, 'Timer frozen: ' + name, NOTICE_COLOR_THEME.staff);        
        } else if (result.status === TIMER_STATUS.unknown) {
            printCommandResult(ctx, 'Timer unknown: ' + name, NOTICE_COLOR_THEME.error);        
        } else {
            printCommandResult(ctx, 'Timer, unknown error: ' + name, NOTICE_COLOR_THEME.error);    
        }
    } else {
        const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`
        printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);    
    }
}

function cliTimerStop(ctx: CBcontext, args: Args, cliInfo: CliInfo) {
    if (args.length === 1) {
        const moduleTimer: ModuleTimer = ModuleTimer.getFromKV(ctx) as ModuleTimer;
        const name = args[0];
        const result = moduleTimer.stopTimer(ctx, name);
        if (result.status === TIMER_STATUS.justStoped) {
            moduleTimer.storeToKV(ctx);
            printCommandResult(ctx, 'Timer stoped: ' + name, NOTICE_COLOR_THEME.staff);        
        } else if (result.status === TIMER_STATUS.unknown) {
            printCommandResult(ctx, 'Timer unknown: ' + name, NOTICE_COLOR_THEME.error);        
        } else {
            printCommandResult(ctx, 'Timer, unknown error: ' + name, NOTICE_COLOR_THEME.error);    
        }
    } else {
        const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`
        printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);    
    }
}

function cliTimerStopAll(ctx: CBcontext) {
        const moduleTImer: ModuleTimer = ModuleTimer.getFromKV(ctx) as ModuleTimer;
        moduleTImer.stopAllTimer(ctx);
        moduleTImer.storeToKV(ctx);
        cliTimerListTimers(ctx);
}

function cliTimerAddTimer(ctx: CBcontext, args: Args, cliInfo: CliInfo) {
    if (args.length >= 2) {
        const moduleTimer: ModuleTimer = ModuleTimer.getFromKV(ctx) as ModuleTimer;
        const timerLength = parseInt(args[0]);
        const timerMessage = args.slice(1).join(' ');

        const existingNames = Object.keys(moduleTimer.getAvaillableTimers());
        let timerName = null;
        AVAILLABLE_LIVE_SETTINGS_NAMES.some(pName => {
            if (!existingNames.includes(pName)) {
                timerName = pName;
                return true;
            }
        });
        if (timerName && timerLength) {
            const result = moduleTimer.addLiveTimer(ctx, timerName, timerLength, timerMessage, false);
            moduleTimer.storeToKV(ctx);
            const msg = `OK: timer ${result.timerInfo.name} created`
            printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);    
        } else {
            let msg = ''
            if (!timerLength) {
                msg = msg + 'ERROR: length not correct: ' + args[0] + ' \n';
            }
            if (!timerName) {
                msg = msg + 'ERROR: No free timer name' +  '\n';
            }
            msg = msg + `${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <length in sec> <message>`
    
            printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
        }
    } else {
        const msg = `Please enter timer infos
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <length in sec> <message>`
        printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);    
    }
}

function cliTimerdeleteTimer(ctx: CBcontext, args: Args, cliInfo: CliInfo) {
    if (args.length === 1) {
        const moduleTimer: ModuleTimer = ModuleTimer.getFromKV(ctx) as ModuleTimer;
        const name = args[0];
        const existingNames = Object.keys(moduleTimer.liveTimers);

        if (existingNames.includes(name)) {
            const result = moduleTimer.deleteLiveTimer(ctx, name);
            if (result.status === TIMER_STATUS.deleted) {
                moduleTimer.storeToKV(ctx);
                printCommandResult(ctx, 'Timer deleted: ' + name, NOTICE_COLOR_THEME.staff);            
            }
        } else {
            printCommandResult(ctx, 'Timer not found or Static Timer: ' + name, NOTICE_COLOR_THEME.error);    
        }
    } else {
        const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`
        printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);    
    }
}

function cliTimerListTimers(ctx: CBcontext) {
    const moduleTimer: ModuleTimer = ModuleTimer.getFromKV(ctx) as ModuleTimer;
    const timers = moduleTimer.getStatus();
    let msg = `Timers list:`
    let m = '';
    console.log(timers);
    Object.entries(timers).forEach(([tName, tInfo]) => {
        if (typeof tInfo.state === 'undefined') {
            m = `${tName}: ${tInfo.length}sec '${tInfo.message}'`;            
        } else if (tInfo.state === TIMER_STATUS.running) {
            m = `${tName}: ${tInfo.length}sec ${tInfo.state} ${tInfo.timerLength - Math.round((Date.now() - tInfo.lastStartTime) / 1000)}sec rem '${tInfo.message}'`;
        } else if (tInfo.state === TIMER_STATUS.frozen) {
            m = `${tName}: ${tInfo.length}sec ${tInfo.state} ${tInfo.remainingLength}sec remaining '${tInfo.message}'`;
        }
        msg = `${msg}
        ${m}`;
    });

    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
}




type CBSettings = {
    [key: string]: string | boolean | number,
};

type CBObj = {
[key: string]: unknown | typeof cbFunction,
};

// interface Example {
//     func(...args: any[]): void;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cbFunction(..._args: unknown[]): unknown {
    return false
}


const $settingshelper: CBSettings = {};

const $kvhelper: CBObj = {
    //get: (...) => {return null;},
    get: cbFunction,
}

export {$settingshelper, $kvhelper};


function logIt(message: unknown) {
    const stack = new Error().stack;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const caller = stack.split('\n')[2].trim().split(/\s+/)[1];

 //   console.log(stack);
//    console.log(stack + "----\n" + caller + "----\n" + message);
//    console.log(message + "\nCaller ----> " + caller + "\nStack ----V\n" + stack);
    console.log(message + "\nCaller ----> " + caller);
}

export {logIt};
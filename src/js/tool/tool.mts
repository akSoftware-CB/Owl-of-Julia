

function getRandomInt(min: number, max: number) {
    const tMin = Math.ceil(min);
    const tMax = Math.floor(max);
    return Math.floor(Math.random() * (tMax - tMin) + tMin); // The maximum is exclusive and the minimum is inclusive
}
  
export function getRandomID(strengh = 2) {
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

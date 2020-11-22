export function pad(str: string) {
    return (str.length == 1) ? '0' + str : str;
}

/** Returns a random integer between min (inclusive) and max (inclusive) */
export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Returns a random byte value between 0 and 0xff */
export function randomByte() {
    return randomInt(0, 0xff);
}
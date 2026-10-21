export const randomComponent = (min = -10, max = 10) => Math.random() * (max - min) + min;
export const getRandomCount = (min = 10, max = 15) => Math.floor(Math.random() * (max - min + 1)) + min;

export function formatSignedFixed(n, width = 7) {
    const sign = n >= 0 ? '+' : '-';
    const abs = Math.abs(n).toFixed(2);   // always 2 decimals
    const str = sign + abs;               // e.g., "+04.50", "-12.50"
    return str.padStart(width, ' ');      // pad to fixed width
}
export function formatIndex(n) {
    return String(n).padStart(2, '0');
}

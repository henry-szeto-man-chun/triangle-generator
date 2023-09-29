export function roundToDecimal(x: number, n: number) {
    let k = 10 ** n
    return Math.round(x * k) / k
}
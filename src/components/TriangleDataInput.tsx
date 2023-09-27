import React from "react";

function AngleInput({prompt, getter, index, handler}: {prompt: string, getter: number[], index: number, handler: Function}) {
    const id = React.useId()
    return (
        <>
            <label htmlFor={id}>{prompt}</label>
            <input
                id={id}
                className='inputs angles'
                type='number'
                value={isNaN(getter[index]) ? '' : roundToDecimal(getter[index], 2)}
                min='0.01'
                max='179.98'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handler(e.currentTarget.value, index)}
            />
        </>
    )
}

function LengthInput({prompt, getter, index, handler}: {prompt: string, getter: number[], index: number, handler: Function}) {
    const id = React.useId()
    return (
        <>
            <label htmlFor={id}>{prompt}</label>
            <input
                id={id}
                className='inputs lengths'
                type='number'
                value={isNaN(getter[index]) ? '' : roundToDecimal(getter[index], 2)}
                min='0.01'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handler(e.currentTarget.value, index)}
            />
        </>
    )
}

function roundToDecimal(x: number, n: number) {
    let k = 10 ** n
    return Math.round(x * k) / k
}

export {
    AngleInput,
    LengthInput
}
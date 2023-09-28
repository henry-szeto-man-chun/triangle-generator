import React from "react";

function AngleInput({prompt, getter, index, handler, inferredValue}: {prompt: string, getter: number[], index: number, handler: Function, inferredValue: number}) {
    const id = React.useId()

    return (
        <>
            <label htmlFor={id}>{prompt}</label>
            <input
                id={id}
                className='inputs'
                type='number'
                value={isNaN(getter[index]) ? '' : roundToDecimal(getter[index], 2)}
                placeholder={(!isNaN(inferredValue) && isNaN(getter[index])) ? roundToDecimal(inferredValue, 2).toString() : ''}
                disabled={!isNaN(inferredValue) && isNaN(getter[index])}
                min='0'
                max='180'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handler(e.currentTarget.value, index)}
            />
        </>
    )
}

function LengthInput({prompt, getter, index, handler, inferredValue}: {prompt: string, getter: number[], index: number, handler: Function, inferredValue: number}) {
    const id = React.useId()
    return (
        <>
            <label htmlFor={id}>{prompt}</label>
            <input
                id={id}
                className='inputs'
                type='number'
                value={isNaN(getter[index]) ? '' : roundToDecimal(getter[index], 2)}
                placeholder={(!isNaN(inferredValue) && isNaN(getter[index])) ? roundToDecimal(inferredValue, 2).toString() : ''}
                disabled={!isNaN(inferredValue) && isNaN(getter[index])}
                min='0'
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
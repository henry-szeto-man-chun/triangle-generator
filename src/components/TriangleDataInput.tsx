import React from "react";
import Triangle from "../Triangle";

function AnglesInputGroup({ getter, handler, triangle }: { getter: number[], handler: Function, triangle: Triangle | null }) {
    const labels = ['\u{03b1}: ', '\u{03b2}: ', '\u{03b3}: ']
    const inputs = labels.map((label, index) =>
        <li className="data-input">
            <AngleInput label={label} getter={getter} index={index} handler={handler} triangle={triangle} />
        </li>
    );

    return (
        <ul>
            {inputs}
        </ul>
    )
}

function AngleInput({ label, getter, index, handler, triangle }: { label: string, getter: number[], index: number, handler: Function, triangle: Triangle | null }) {
    const id = React.useId()
    const inferredValue = (triangle !== null) ? triangle.angles[index] : NaN

    return (
        <>
            <label htmlFor={id}>{label}</label>
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

function SidesInputGroup({ getter, handler, triangle }: { getter: number[], handler: Function, triangle: Triangle | null }) {
    const labels = ['a: ', 'b: ', 'c: '];
    const inputs = labels.map((label, index) => 
        <li className="data-input">
            <SideInput label={label} getter={getter} index={index} handler={handler} triangle={triangle} />
        </li>
    );

    return (
        <ul>
            {inputs}
        </ul>
    )
}

function SideInput({ label, getter, index, handler, triangle }: { label: string, getter: number[], index: number, handler: Function, triangle: Triangle | null }) {
    const id = React.useId()
    const inferredValue = (triangle !== null) ? triangle.lengths[index] : NaN

    return (
        <>
            <label htmlFor={id}>{label}</label>
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
    AnglesInputGroup,
    SidesInputGroup
}
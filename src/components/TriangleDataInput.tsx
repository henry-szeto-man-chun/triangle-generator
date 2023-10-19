import React, { useContext } from "react";
import Triangle from "../models/Triangle";
import { roundToDecimal } from "../utils";
import { triangleContext } from "../models/TriangleContext";

function AnglesInputGroup({ getter, handler }: { getter: number[], handler: Function }) {
    const labels = ['\u{03b1}: ', '\u{03b2}: ', '\u{03b3}: ']
    const inputs = labels.map((label, index) =>
        <AngleInput
            key={index}
            label={label}
            getter={getter}
            index={index}
            handler={handler} />
    );

    return (
        <div className="horizontal-flex">
            {inputs}
        </div>
    )
}

function AngleInput({ label, getter, index, handler }: { label: string, getter: number[], index: number, handler: Function }) {
    const triangle = useContext(triangleContext)
    const id = React.useId()
    const inferredValue = (triangle !== null) ? triangle.angles[index] : NaN

    return (
        <div className="input-wrapper">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                key={index}
                className='input-wide'
                type='number'
                value={isNaN(getter[index]) ? '' : roundToDecimal(getter[index], 2)}
                placeholder={(!isNaN(inferredValue) && isNaN(getter[index])) ? roundToDecimal(inferredValue, 2).toString() : ''}
                disabled={!isNaN(inferredValue) && isNaN(getter[index])}
                min='0'
                max='180'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handler(e.currentTarget.value, index)}
            />
        </div>
    )
}

function SidesInputGroup({ getter, handler }: { getter: number[], handler: Function }) {
    const labels = ['a: ', 'b: ', 'c: '];
    const inputs = labels.map((label, index) =>
        <SideInput
            key={index}
            label={label}
            getter={getter}
            index={index}
            handler={handler} />
    );

    return (
        <div className="horizontal-flex">
            {inputs}
        </div>
    )
}

function SideInput({ label, getter, index, handler }: { label: string, getter: number[], index: number, handler: Function }) {
    const triangle = useContext(triangleContext)
    const id = React.useId()
    const inferredValue = (triangle !== null) ? triangle.sides[index] : NaN

    return (
        <div className="input-wrapper">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                key={index}
                className='input-wide'
                type='number'
                value={isNaN(getter[index]) ? '' : roundToDecimal(getter[index], 2)}
                placeholder={(!isNaN(inferredValue) && isNaN(getter[index])) ? roundToDecimal(inferredValue, 2).toString() : ''}
                disabled={!isNaN(inferredValue) && isNaN(getter[index])}
                min='0'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handler(e.currentTarget.value, index)}
            />
        </div>
    )
}

export {
    AnglesInputGroup,
    SidesInputGroup
}
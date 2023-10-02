import { ReactNode, useId, useState } from "react"

function AngleLabelsInputGroup({ labelData, setLabelData }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>> }) {
    const angleNames = ['\u{03b1}', '\u{03b2}', '\u{03b3}']
    const inputs = angleNames.map((name, index) =>
        <>
            <div>{name}</div>
            <AngleArcInput labelData={labelData} setLabelData={setLabelData} index={index} />
            <AngleDegreeInput labelData={labelData} setLabelData={setLabelData} index={index} />
            <AngleTextInput labelData={labelData} setLabelData={setLabelData} index={index} />
        </>
    );

    return (
        <div className="label-grid">
            <span></span>
            <span className="grid-main">Arc</span>
            <span className="grid-sub">Radius</span>
            <span className="grid-main">Degree</span>
            <span className="grid-sub">Size</span>
            <span className="grid-sub">Offset</span>
            <span className="grid-main">Label</span>
            <span className="grid-sub">Text</span>
            <span className="grid-sub">Size</span>
            <span className="grid-sub">Offset</span>
            {inputs}
        </div>
    )
}

function InputWrapper({ isChecked, onCheck, children }: { isChecked: boolean, onCheck: Function, children: ReactNode }) {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onCheck(e.currentTarget.checked)
    }

    return (
        <>
            <div className="grid-main">
                <input type="checkbox" checked={isChecked} onChange={handleChange} />
            </div>
            {children}
        </>
    )
}

function AngleArcInput({ labelData, setLabelData, index }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>>, index: number }) {
    const id = useId()

    function handleCheck(checked: boolean) {
        setLabelData({
            ...labelData,
            angleArc: (labelData.angleArc as boolean[]).map((prevValue, i) => {
                if (i === index) return checked;
                else return prevValue;
            })
        });
    }

    function handleRadiusChange(radius: string) {
        setLabelData({
            ...labelData,
            angleArcRadius: (labelData.angleArcRadius as number[]).map((prevValue, i) => {
                if (i === index) return parseFloat(radius);
                else return prevValue;
            })
        });
    }

    return (
        <InputWrapper
            isChecked={(labelData.angleArc as boolean[])[index]}
            onCheck={handleCheck}>
                <div><input
                    id={id}
                    className="grid-input"
                    type="number"
                    value={(labelData.angleArcRadius as number[])[index].toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRadiusChange(e.currentTarget.value)}
                /></div>
        </InputWrapper>
    )
}

function AngleDegreeInput({ labelData, setLabelData, index }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>>, index: number }) {
    const id1 = useId()
    const id2 = useId()

    function handleCheck(checked: boolean) {
        setLabelData({
            ...labelData,
            angleDegree: (labelData.angleDegree as boolean[]).map((prevValue, i) => {
                if (i === index) return checked;
                else return prevValue;
            })
        });
    }

    function handleSizeChange(size: string) {
        setLabelData({
            ...labelData,
            angleDegreeSize: (labelData.angleDegreeSize as number[]).map((prevValue, i) => {
                if (i === index) return parseFloat(size);
                else return prevValue;
            })
        });
    }

    function handleOffsetChange(offset: string) {
        setLabelData({
            ...labelData,
            angleDegreeOffset: (labelData.angleDegreeOffset as number[]).map((prevValue, i) => {
                if (i === index) return parseFloat(offset);
                else return prevValue;
            })
        });
    }

    return (
        <InputWrapper
            isChecked={(labelData.angleDegree as boolean[])[index]}
            onCheck={handleCheck}>
            <div><input
                id={id1}
                className="grid-input"
                type="number"
                min={1}
                value={(labelData.angleDegreeSize as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange(e.currentTarget.value)}
            /></div>
            <div><input
                id={id2}
                type="range"
                className="grid-input"
                min={-2.5}
                max={2.0}
                step={0.05}
                value={(labelData.angleDegreeOffset as number[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOffsetChange(e.currentTarget.value)}
            /></div>
        </InputWrapper>
    )
}

function AngleTextInput({ labelData, setLabelData, index }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>>, index: number }) {
    const id1 = useId()
    const id2 = useId()
    const id3 = useId()

    function handleCheck(checked: boolean) {
        setLabelData({
            ...labelData,
            angleLabel: (labelData.angleLabel as boolean[]).map((prevValue, i) => {
                if (i === index) return checked;
                else return prevValue;
            })
        });
    }

    function handleTextChange(text: string) {
        setLabelData({
            ...labelData,
            angleLabelText: (labelData.angleLabelText as number[]).map((prevValue, i) => {
                if (i === index) return text;
                else return prevValue;
            })
        });
    }

    function handleSizeChange(size: string) {
        setLabelData({
            ...labelData,
            angleLabelSize: (labelData.angleLabelSize as number[]).map((prevValue, i) => {
                if (i === index) return parseFloat(size);
                else return prevValue;
            })
        });
    }

    function handleOffsetChange(offset: string) {
        setLabelData({
            ...labelData,
            angleLabelOffset: (labelData.angleLabelOffset as number[]).map((prevValue, i) => {
                if (i === index) return parseFloat(offset);
                else return prevValue;
            })
        });
    }

    return (
        <InputWrapper
            isChecked={(labelData.angleLabel as boolean[])[index]}
            onCheck={handleCheck}>
            <div><input
                id={id1}
                className="grid-input"
                type="text"
                value={(labelData.angleLabelText as string[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(e.currentTarget.value)}
            /></div>
            <div><input
                id={id2}
                className="grid-input"
                type="number"
                min={1}
                value={(labelData.angleLabelSize as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange(e.currentTarget.value)}
            /></div>
            <div><input
                id={id3}
                type="range"
                className="grid-input"
                min={-2.5}
                max={2.0}
                step={0.05}
                value={(labelData.angleLabelOffset as number[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOffsetChange(e.currentTarget.value)}
            /></div>
        </InputWrapper>
    )
}

export default AngleLabelsInputGroup
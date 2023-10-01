import { ReactNode, useId, useState } from "react"

function AngleLabelsInputGroup({ labelData, setLabelData }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>> }) {
    const angleNames = ['\u{03b1}:', '\u{03b2}:', '\u{03b3}:']
    const inputs = angleNames.map((name, index) =>
        <tr key={index}>
            <td>{name}</td>
            <td><AngleArcInput labelData={labelData} setLabelData={setLabelData} index={index} /></td>
            <td><AngleDegreeInput labelData={labelData} setLabelData={setLabelData} index={index} /></td>
            <td><AngleTextInput labelData={labelData} setLabelData={setLabelData} index={index} /></td>
        </tr>
    );

    return (
        <table>
            <thead>
                <tr>
                    <td></td><td>Arc</td><td>Degree</td><td>Label</td>
                </tr>
            </thead>
            <tbody>
                {inputs}
            </tbody>
        </table>
    )
}

function InputWrapper({ isChecked, onCheck, children }: { isChecked: boolean, onCheck: Function, children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(isChecked)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onCheck(e.currentTarget.checked)
        setIsOpen(e.currentTarget.checked)
    }

    return (
        <div style={{ display: "flex" }}>
            <input type="checkbox" checked={isChecked} onChange={handleChange}></input>
            <div className={isOpen ? "foldable opened" : "foldable closed"}>
                {children}
            </div>
            <button className={isChecked ? "" : "hidden"} onClick={() => setIsOpen(!isOpen)}>{isOpen ? "<" : "\u2026"}</button>
        </div>
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
            <label htmlFor={id}>Radius: </label>
            <input
                id={id}
                className="input-narrow"
                type="number"
                value={(labelData.angleArcRadius as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRadiusChange(e.currentTarget.value)}
            />
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
            <label htmlFor={id1}>Size: </label>
            <input
                id={id1}
                className="input-narrow"
                type="number"
                min={1}
                value={(labelData.angleDegreeSize as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange(e.currentTarget.value)}
            />
            <label htmlFor={id2}>Offset: </label>
            <input
                id={id2}
                type="range"
                min={-2.0}
                max={2.0}
                step={0.1}
                value={(labelData.angleDegreeOffset as number[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOffsetChange(e.currentTarget.value)}
            />
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
            <label htmlFor={id1}>Text: </label>
            <input
                id={id1}
                className="input-narrow"
                type="text"
                value={(labelData.angleLabelText as string[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(e.currentTarget.value)}
            />
            <label htmlFor={id2}>Size: </label>
            <input
                id={id2}
                className="input-narrow"
                type="number"
                min={1}
                value={(labelData.angleLabelSize as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange(e.currentTarget.value)}
            />
            <label htmlFor={id3}>Offset: </label>
            <input
                id={id3}
                type="range"
                min={-2.0}
                max={2.0}
                step={0.1}
                value={(labelData.angleLabelOffset as number[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOffsetChange(e.currentTarget.value)}
            />
        </InputWrapper>
    )
}

export default AngleLabelsInputGroup
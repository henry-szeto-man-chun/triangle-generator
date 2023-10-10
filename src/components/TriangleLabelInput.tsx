import { ReactNode } from "react"

function AngleLabelsInputGroup({ labelData, setLabelData }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>> }) {
    const angleNames = ['\u{03b1}', '\u{03b2}', '\u{03b3}']
    const inputs = angleNames.map((name, index) =>
        <>
            <div>{name}</div>
            <AngleTextInput labelData={labelData} setLabelData={setLabelData} index={index} />
            <AngleArcInput labelData={labelData} setLabelData={setLabelData} index={index} />
            <AngleDegreeInput labelData={labelData} setLabelData={setLabelData} index={index} />
        </>
    );

    return (
        <div className="label-grid angle">
            <span></span>
            <span className="grid-main">Label</span>
            <span className="grid-sub">Text</span>
            <span className="grid-sub">Size</span>
            <span className="grid-sub">Offset</span>
            <span className="grid-main">Arc</span>
            <span className="grid-sub">Size</span>
            <span className="grid-main">Degree</span>
            <span className="grid-sub">Size</span>
            <span className="grid-sub">Offset</span>
            {inputs}
        </div>
    )
}

function SideLabelsInputGroup({ labelData, setLabelData }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>> }) {
    const sideNames = ['a', 'b', 'c']
    const inputs = sideNames.map((name, index) =>
        <>
            <div>{name}</div>
            <SideTextInput labelData={labelData} setLabelData={setLabelData} index={index} />
        </>
    );

    return (
        <div className="label-grid side">
            <span></span>
            <span className="grid-main">Label</span>
            <span className="grid-sub">Text</span>
            <span className="grid-sub">Size</span>
            <span className="grid-sub">Offset</span>
            {inputs}
        </div>
    );
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
                className="grid-input"
                type="number"
                value={(labelData.angleArcRadius as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRadiusChange(e.currentTarget.value)}
            /></div>
        </InputWrapper>
    )
}

function AngleDegreeInput({ labelData, setLabelData, index }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>>, index: number }) {

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
                className="grid-input"
                type="number"
                min={1}
                value={(labelData.angleDegreeSize as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange(e.currentTarget.value)}
            /></div>
            <div><input
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
                className="grid-input"
                type="text"
                value={(labelData.angleLabelText as string[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(e.currentTarget.value)}
            /></div>
            <div><input
                className="grid-input"
                type="number"
                min={1}
                value={(labelData.angleLabelSize as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange(e.currentTarget.value)}
            /></div>
            <div><input
                type="range"
                className="grid-input"
                min={-2.5}
                max={2.0}
                step={0.05}
                value={(labelData.angleLabelOffset as number[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOffsetChange(e.currentTarget.value)}
            /></div>
        </InputWrapper>
    );
}

function SideTextInput({ labelData, setLabelData, index }: { labelData: any, setLabelData: React.Dispatch<React.SetStateAction<any>>, index: number }) {
    
    function handleCheck(checked: boolean) {
        setLabelData({
            ...labelData,
            sideLabel: (labelData.sideLabel as boolean[]).map((prevValue, i) => {
                if (i === index) return checked;
                else return prevValue;
            })
        });
    }

    function handleTextChange(text: string) {
        setLabelData({
            ...labelData,
            sideLabelText: (labelData.sideLabelText as number[]).map((prevValue, i) => {
                if (i === index) return text;
                else return prevValue;
            })
        });
    }

    function handleSizeChange(size: string) {
        setLabelData({
            ...labelData,
            sideLabelSize: (labelData.sideLabelSize as number[]).map((prevValue, i) => {
                if (i === index) return parseFloat(size);
                else return prevValue;
            })
        });
    }

    function handleOffsetChange(offset: string) {
        setLabelData({
            ...labelData,
            sideLabelOffset: (labelData.sideLabelOffset as number[]).map((prevValue, i) => {
                if (i === index) return parseFloat(offset);
                else return prevValue;
            })
        });
    }

    return (
        <InputWrapper
            isChecked={(labelData.sideLabel as boolean[])[index]}
            onCheck={handleCheck}>
            <div><input
                className="grid-input"
                type="text"
                value={(labelData.sideLabelText as string[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(e.currentTarget.value)}
            /></div>
            <div><input
                className="grid-input"
                type="number"
                min={1}
                value={(labelData.sideLabelSize as number[])[index].toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange(e.currentTarget.value)}
            /></div>
            <div><input
                type="range"
                className="grid-input"
                min={-2.5}
                max={2.0}
                step={0.05}
                value={(labelData.sideLabelOffset as number[])[index]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOffsetChange(e.currentTarget.value)}
            /></div>
        </InputWrapper>
    );
}

export {
    AngleLabelsInputGroup,
    SideLabelsInputGroup
}
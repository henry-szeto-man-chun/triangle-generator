import { useState } from "react"

function AngleArcInput() {
    const [isOpen, setIsOpen] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setIsOpen(e.currentTarget.checked)
    }

    return (
        <div style={{display: "flex"}}>
            <input type="checkbox" onChange={handleChange}></input>
            <div className={ isOpen ? "foldable opened" : "foldable closed" }>
                <label>Radius: </label><input className="input-narrow" type="number"></input>
            </div>
            <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "<" : "\u2026"}</button>
        </div>
    )
}

function AngleDegreeInput() {
    const [isOpen, setIsOpen] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setIsOpen(e.currentTarget.checked)
    }

    return (
        <div style={{display: "flex", verticalAlign: "middle"}}>
            <input type="checkbox" onChange={handleChange}></input>
            <div className={ isOpen ? "foldable opened" : "foldable closed" }>
                <label>Size: </label><input className="input-narrow" type="number"></input>
                <label>Offset: </label><input type="range"></input>
            </div>
            <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "<" : "\u2026"}</button>
        </div>
    )
}

function AngleLabelInput() {
    const [isOpen, setIsOpen] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setIsOpen(e.currentTarget.checked)
    }

    return (
        <div style={{display: "flex", verticalAlign: "middle"}}>
            <input type="checkbox" onChange={handleChange}></input>
            <div className={ isOpen ? "foldable opened" : "foldable closed" }>
                <label>Text: </label><input className="input-narrow" type="text"></input>
                <label>Size: </label><input className="input-narrow" type="number"></input>
                <label>Offset: </label><input type="range"></input>
            </div>
            <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "<" : "\u2026"}</button>
        </div>
    )
}

export {
    AngleArcInput,
    AngleDegreeInput,
    AngleLabelInput
}
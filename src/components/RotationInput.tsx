function RotationInput({rotation, onRotationChange}: {rotation: number, onRotationChange: Function}) {
    return (
        <>
        <input
          className='slider'
          type='range'
          min='-180'
          max='180'
          value={rotation.toString()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onRotationChange(e.currentTarget.value)} />
        <input
          type='number'
          min='-180'
          max='180'
          value={rotation.toString()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onRotationChange(e.currentTarget.value)} />
        </>
    )
}

export default RotationInput;
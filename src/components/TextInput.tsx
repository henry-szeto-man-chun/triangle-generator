import React from 'react';

function TextInput({ prompt, getter, setter }: { prompt: string, getter: string, setter: React.Dispatch<React.SetStateAction<string>> }) {
  const id = React.useId()
    return (
      <>
        <label htmlFor={id}>{prompt}</label>
        <input
          className='labelInputs'
          type='text'
          value={getter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.currentTarget.value)}
          id={id}
        />
      </>
    )
  }

export default TextInput
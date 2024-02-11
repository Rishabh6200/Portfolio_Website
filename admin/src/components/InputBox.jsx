import React from 'react'

const InputBox = ({ inputValue, placeholder, name, value, onChange, accept }) => {

    return (
        <>
            <input type={inputValue}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                accept={accept}
                name={name}
                onChange={onChange}
                value={value}
            />
        </>
    )
}

export default InputBox
import { Form, Input } from 'antd'
import React from 'react'
import './InputText.css'
const InputText = ({ label, name, type, message, style }) => {
   return (
      <>
         <Input type={type} className={style} placeholder={label} />
      </>
   )
}

export default InputText
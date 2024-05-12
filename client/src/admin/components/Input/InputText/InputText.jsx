import { Form, Input } from 'antd'
import React from 'react'
import './InputText.css'
const InputText = ({ label, name, type, message }) => {
   return (
      <>
         <Form.Item
            label={label}
            name={name}
            rules={[
               {
                  required: true,
                  message: message,
               },
            ]}
         >
            <Input type={type} placeholder={label} />
         </Form.Item >
      </>
   )
}

export default InputText
import { Button, Form } from 'antd'
import React from 'react'
import './FormButton.css'

const FormButton = ({ title }) => {
   return (
      <>
         <Form.Item className='formbtn'>
            <Button type="primary" htmlType="submit">
             {title}
            </Button>
         </Form.Item>
      </>
   )
}

export default FormButton
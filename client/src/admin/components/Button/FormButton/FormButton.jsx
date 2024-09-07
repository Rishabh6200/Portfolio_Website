import { Button, ConfigProvider, Form } from 'antd'
import React from 'react'
import './FormButton.css'

const FormButton = ({ title, loading }) => {
   return (
      <>
         <ConfigProvider
            theme={{
               components: {
                  Button: {
                     colorPrimaryHover: "#FF6969",
                     
                  },
               },
            }}
         >
            <Button
               type="primary"
               htmlType="submit"
               loading={loading}
               className='!bg-themeBtn w-full h-10 text-lg'
            >
               {title}
            </Button>
         </ConfigProvider>
      </>
   )
}

export default FormButton;
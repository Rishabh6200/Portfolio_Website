import React, { useEffect, useState } from 'react'
import './Login.css'
import { Form } from 'antd'
import InputText from '../../components/Input/InputText/InputText'
import FormButton from '../../components/Button/FormButton/FormButton'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import httpComman from '../../../api/httpComman'
import { loginUser } from '../feature/authSlice'

const Login = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const { user } = useSelector((state) => state.auth);

   const field = [
      {
         name: "userName",
         label: "UserName",
         type: "text",
         message: "Please, Enter your username!"
      },
      {
         name: "password",
         label: "Password",
         type: "password",
         message: "Please, Enter your password!"
      },
   ]

   const onFinish = async (value) => {
      setLoading(true)
      const res = await httpComman.post('/login', value)
      const apiData = res.data;
      if (apiData.status === false) {
         console.log(apiData.message)
         setLoading(false)
      } else {
         dispatch(loginUser(apiData))
         setLoading(false)
      }
   }

   useEffect(() => {
      if (user) {
         navigate('/admin')
      }
   })

   return (
      <>
         <div className="w-full h-screen bg-white  ">
            <div className="background">
               <div className="shape"></div>
               <div className="shape"></div>
            </div>
            <Form
               onFinish={onFinish}
               layout="vertical"
               autoComplete="off"
               className='p-5 py-10 text-white '
            >
               <h3 className='pb-5 border-b-4'>Admin Login</h3>

               {field.map((item, i) => (
                  <InputText {...item} key={i} />
               ))}

               <FormButton title="Login" loading={loading} />
            </Form>
         </div >
      </>
   )
}

export default Login
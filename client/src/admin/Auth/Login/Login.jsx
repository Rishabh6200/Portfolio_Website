import React, { useEffect, useState } from 'react'
import { Form, Input } from 'antd'
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
         <section className="w-full h-screen bg-black flex justify-center">
            <div className="w-3/12 bg-[#ffffff26] mx-auto mt-32 h-[55%] rounded-2xl shadow shadow-white">
               <div className="mx-7 py-10">
                  <h3 className='pb-5 text-3xl text-center font-mono font-bold text-gray-100'>Admin Login</h3>
                  <Form
                     onFinish={onFinish}
                     layout="vertical"
                     autoComplete="off"
                     className="w-full mt-8"
                  >
                     <Form.Item
                        name="userName"
                        rules={[
                           {
                              required: true,
                              message: "User Name is Required !"
                           }
                        ]}
                     >
                        <Input placeholder='User Name' className='h-12 w-full bg-white' />
                     </Form.Item>
                     <Form.Item
                        name="password"
                        rules={[
                           {
                              required: true,
                              message: "Password is Required !"
                           }
                        ]}
                     >
                        <Input.Password placeholder='************' className='h-12 w-full' />
                     </Form.Item>

                     <FormButton title="Login" loading={loading} />
                  </Form>
               </div>
            </div>
         </section >
      </>
   )
}

export default Login
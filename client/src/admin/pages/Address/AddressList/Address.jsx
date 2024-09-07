import React, { useEffect, useState } from 'react'
import httpComman from '../../../../api/httpComman'
import Heading from '../../../components/Heading/Heading';
import { Form, Input } from 'antd';
import FormButton from '../../../components/Button/FormButton/FormButton';
import InputText from '../../../components/Input/InputText/InputText';
import { setAddress } from '../../../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
const Address = () => {
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const { address } = useSelector((s) => s.all)
   
   const value = {
      email: address?.email,
      phone: address?.phono,
      address: address?.address,
   }

   const field = [
      {
         name: "email",
         label: "Email",
         type: "text",
         message: "Please, Enter your email !"
      },
      {
         name: "phone",
         label: "Phone",
         type: "text",
         message: "Please, Enter your Phone No. !"
      },
   ]

   const onFinish = async () => {
      setLoading(true)

      setLoading(false)
   }

   const fetchAddress = async () => {
      const res = await httpComman.get('/address')
      const apiData = res.data;
      if (apiData && apiData.length > 0) {
         const fetchedData = apiData[0];
         dispatch(setAddress(fetchedData))
      }
   }

   useEffect(() => {
      fetchAddress();
   }, [])

   return (
      <>
         <div className="admin-container">
            <Heading heading="My Address" />
            <div className="w-full">
               <Form
                  onFinish={onFinish}
                  layout="vertical"
                  autoComplete="off"
                  className='p-5 py-10 mx-auto'
                  initialValues={value}
               >
                  <div className="grid grid-cols-2 gap-4">
                     {field.map((item, i) => (
                        <InputText {...item} key={i} style="focus:border-2 font-semibold text-lg focus:border-gray-800 placeholder:text-gray-600" />
                     ))}
                  </div>
                  <Form.Item
                     label="Address"
                     name="address"
                     rules={[
                        {
                           required: true,
                           message: "Please, Enter your Address !",
                        },
                     ]}
                  >
                     <Input.TextArea className='focus:border-2 font-semibold text-lg focus:border-gray-800 placeholder:text-gray-600' placeholder="Address" rows={4} />
                  </Form.Item >
                  <FormButton title="Update" loading={loading} />
               </Form>
            </div>
         </div>
      </>
   )
}

export default Address
import React, { useState } from 'react';
import InputBox from '../../../components/Input/InputBox';
import Buttton from '../../../components/Button/Buttton';
import httpComman from '../../../../api/httpComman';

const Address = () => {
   const initialFormData = {
      address: '',
      email: '',
      phono: '',
   };
   const [formData, setFormData] = useState(initialFormData);

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await httpComman.patch('/address', formData);
         console.log('Data successfully posted:', res.data);
         setFormData(initialFormData);
      } catch (error) {
         console.log('Error:', error);
      }
   };

   const inputData = [
      {
         name: 'address',
         inputValue: 'text',
         placeholderValue: 'New Address',
      },
      {
         name: 'email',
         inputValue: 'text',
         placeholderValue: 'New E-mail',
      },
      {
         name: 'phono',
         inputValue: 'text',
         placeholderValue: 'New Mobile Number',
      },
   ];

   return (
      <>
         <div className="admin-dashboard">
            h
         </div>
      </>
   );
};

export default Address;

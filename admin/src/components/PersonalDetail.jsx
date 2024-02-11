import React, { useState } from 'react'
import InputBox from './InputBox'
import Buttton from './Buttton'
import httpComman from '../api/httpComman';

const PersonalDetail = () => {

    const initialFormData = {
        name: '',
        detail: '',
        prof: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    console.log(formData)
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await httpComman.patch('/about', formData);
            console.log('Data successfully posted:', res.data);
            setFormData(initialFormData);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const inputData = [
        {
            name: 'name',
            inputValue: 'text',
            placeholderValue: 'Name',
        }, 
        {
            name: 'prof',
            inputValue: 'text',
            placeholderValue: 'Profession',
        },
    ]

    return (
        <>
            <div className="addskill">
                <h1 className='text-3xl text-center'>Update Personal Detail</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <div className="input">
                        {inputData.map((item, i) => (
                            <div className="input-box">
                                <p>{item.name} :</p>
                                <InputBox
                                    name={item.name}
                                    type={item.inputValue}
                                    placeholder={item.placeholderValue}
                                    value={formData[item.name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                        <div className="input-box w-full">
                            <p>About Detail :</p>
                            <textarea className='rounded-md p-2' cols="47" rows="5" 
                            placeholder='About Detail'
                            name='detail'
                            value={formData.detail}
                            onChange={handleChange}
                            ></textarea>
                        </div>
                        <Buttton name='Update Detail' />
                    </div>
                </form>
            </div>
        </>
    )
}

export default PersonalDetail
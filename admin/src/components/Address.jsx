import React, { useState } from 'react';
import InputBox from './InputBox';
import Buttton from './Buttton';
import httpComman from '../api/httpComman';

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
            <div className="addskill">
                <h1 className="text-3xl text-center">Update Address</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <div className="input">
                        {inputData.map((item, i) => (
                            <div className="input-box" key={i}>
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
                        <Buttton name="Update Address" />
                    </div>
                </form>
            </div>
        </>
    );
};

export default Address;

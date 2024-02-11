import React, { useState } from 'react'
import '../assets/css/Addskill.css'
import InputBox from './InputBox'
import Buttton from './Buttton'
import httpComman from '../api/httpComman'

const Addskill = () => {
  const initialFormData = {
    percentage: '',
    color: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  // console.log(formData)
  const hendleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const hendleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await httpComman.post('/skill', formData);
      console.log('data Success posted', res.data)
      setFormData(initialFormData);
    } catch (error) {
      console.log('error', error)
    }
  }

  const inputData = [
    {
      lable: 'Add Percentage',
      inputValue: 'text',
      placeholderValue: 'Add Percentage',
      name: 'percentage',
      value: formData.percentage,
    },
    {
      lable: 'Add Color',
      inputValue: 'text',
      placeholderValue: 'Add Color',
      name: 'color',
      value: formData.color,
    },
    {
      lable: 'Add Skill Image',
      inputValue: 'file',
      acceptFile: "image/*"
    },
  ]

  return (
    <>
      <div className="addskill">
        <h1 className='text-3xl text-center'>Add Skill</h1>
        <br />
        <form onSubmit={hendleSubmit}>
          <div className="input">
            {inputData.map((item, i) => (
              <div className="input-box" key={item.name}>
                <p>{item.lable} :</p>
                <InputBox name={item.name}
                  inputValue={item.inputValue}
                  accept={item.acceptFile}
                  placeholder={item.placeholderValue}
                  value={item.value}
                  onChange={hendleChange}
                />
              </div>
            ))}
            <Buttton name='Add Skill' />
          </div>
        </form>
      </div>
    </>
  )
}

export default Addskill
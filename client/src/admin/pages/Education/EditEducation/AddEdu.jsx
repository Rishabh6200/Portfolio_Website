import React from 'react'
import InputBox from '../../InputBox'
import Buttton from '../../../components/Button/Buttton';

const AddEdu = () => {

  const inputData = [
    {
      name: 'Eduction Name',
      inputValue: 'text',
      placeholderValue: 'Name',
    },
    {
      name: 'Institution',
      inputValue: 'text',
      placeholderValue: 'Institution Name',
    },
    {
      name: 'Passing Year',
      inputValue: 'text',
      placeholderValue: 'Passing Year',
    },
    {
      name: 'Hobbie',
      inputValue: 'text',
      placeholderValue: 'Hobbie',
    },
  ];

  return (
    <div className='addskill'>
      <h1 className='text-3xl text-center'>Add Eduction</h1>
      <br />
      <form>
        <div className="input">
          {inputData.map((item, i) => (
            <div className="input-box">
              <p>{item.name} :</p>
              <InputBox inputValue={item.inputValue} placeholder={item.placeholderValue} />
            </div>
          ))}
          <Buttton name='Add Eduction' />
        </div>
      </form>
    </div>
  )
}

export default AddEdu
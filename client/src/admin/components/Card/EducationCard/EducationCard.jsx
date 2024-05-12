import React from 'react'
import { CiSquareRemove } from 'react-icons/ci'
import { TbEdit } from 'react-icons/tb'

const EducationCard = ({ name, time, college }) => {
  return (
    <>
      <div className="block w-[30rem] rounded-lg bg-white text-surface shadow-xl border hover:scale-105 transition cursor-pointer">
        <div className=" p-4">
          <h3 className='text-xl font-medium'>{name}</h3>
          <h5 className='text-sm p-1'>{time}</h5>
          <h4 className='text-lg'>{college}</h4>
        </div>
        <hr />
        <div className="py-2 px-4">
          <div className="flex justify-between text-xl mt-2 ">
            <button className='hover:scale-110'>
              <TbEdit size={30} />
            </button>
            <button className='hover:scale-110'>
              <CiSquareRemove size={30} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EducationCard
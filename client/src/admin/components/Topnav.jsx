import React from 'react'
import '../assets/css/Topnav.css'
import { FaHome } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'

const Topnav = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className='topnav'>
        <span
          onClick={() => navigate('/')}
          className='text-white float-end bg-green-600 -my-5 mr-5 p-2 pt-1 rounded-lg inline-flex items-center gap-2 cursor-pointer'
        >
          <FaHome /> Home</span>
      </div>

    </>
  )
}

export default Topnav
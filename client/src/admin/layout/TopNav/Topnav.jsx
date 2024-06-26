import React from 'react'
import './TopNav.css'
import titleImg from '../../assets/images/dashboard.png'
import { useDispatch } from 'react-redux'
import { logOutUser } from '../../Auth/feature/authSlice'

const Topnav = () => {
  const dispatch = useDispatch();
  return (
    <>
      <div className='w-100 p-1 bg-blue-950 flex justify-between'>
        <div className="">
          <div className="title">
            <img src={titleImg} alt="" />
            <h1 className='p-0.5 text-white'>Deshboard</h1>
          </div>
        </div>
        <div className="">
          <span onClick={() => dispatch(logOutUser())}
            className='text-white bg-green-600 p-2 mr-10 mt-1 rounded-lg inline-flex items-center gap-2 cursor-pointer'
          >
            Logout
          </span>
        </div>
      </div>

    </>
  )
}

export default Topnav
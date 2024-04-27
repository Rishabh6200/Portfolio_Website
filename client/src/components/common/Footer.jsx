import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <footer className='text-center p-4 bg-black text-white'>
        <p>All Copyright © <Link to="/admin"> Recived </Link> 2023</p>
      </footer>
    </>
  )
}

export default Footer
import React from 'react'
import '../assets/css/Sidenav.css'
import titleImg from '../assets/images/dashboard.png'
import { Link, Outlet } from 'react-router-dom';

const SideNav = () => {

  const title = 'Deshboard';

  const navLink = ['','addskill','education', 'detail','address']

  const dashLink = [
    {    
      name: "Home",
      skillicon: 'fa-solid fa-house-chimney'
    },
    {
      name: "Add Skill",
      skillicon: 'fa-solid fa-gear'
    },
    {
      name: 'Add Education',
      skillicon: 'fa-solid fa-user-graduate'
    },
    {
      name: 'Update Personal Info.',
      skillicon: 'fa-regular fa-user'
    },
    {
      name: 'Update Address',
      skillicon: 'fa-solid fa-location-crosshairs'
    },
  ]

  return (
    <>
      <nav className='side-nav'>
        <div className="title">
          <img src={titleImg} alt="" />
          <h1 className='dash-heading'>{title}</h1>
        </div>
        <hr />
        <ul className='dash-links'>
          {dashLink.map((item, i) => (
            <li key={item.i}>
              <Link to={navLink[i]} key={i} > <i className={item.skillicon} style={{ "color": "#ffffff" }}></i>{item.name} </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </>
  )
}

export default SideNav
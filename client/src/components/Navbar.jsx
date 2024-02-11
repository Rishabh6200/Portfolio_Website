import React from 'react'
import '../assets/css/Navbar.css'
import { Link, Outlet } from 'react-router-dom';
const Navbar = () => {

    const navData = ['Home', 'About', 'Resume', 'Projects', 'Contact'];
    const navLink = ['', 'about', 'resume', 'project', 'contact'];
    const activeClass = ['current'];
    const value = [1,2,3,4,5,6,7,8,9]
    

    return (
        <>
            <nav className="nav">
                <div className="nav-links">
                    <h1 className="logo">
                        <Link to='/' ><span>My</span> Website</Link>
                    </h1>
                    <ul>
                        {navData.map((item, i) => (
                            <li className='text-black' key={value[i]} >
                                <Link to={`/${navLink[i]}`} className={activeClass[i]}>{navData[i]}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <Outlet />
        </>
    )
}

export default Navbar
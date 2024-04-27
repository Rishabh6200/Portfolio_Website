import React, { useState } from 'react';
import '../../assets/css/Navbar.css';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { IoReorderThreeOutline } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";

const Navbar = () => {
    const navData = ['Home', 'About', 'Resume', 'Project', 'Contact'];
    const navLink = ['', 'about', 'resume', 'project', 'contact'];

    const location = useLocation();
    const isActive = (link) => {
        return location.pathname === `/${link}`;
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className="nav">
                <div className="nav-links">
                    <h1 className="logo">
                        <Link to='/' ><span>My</span> Website</Link>
                    </h1>
                    <button className='nav-btn' onClick={toggleMenu}>
                        {isOpen ? (
                            <FaXmark color='white' size={40} />
                        ) : (
                            <IoReorderThreeOutline color='white' size={40} />
                        )}
                    </button>
                    <ul id={'responsive'} className={`p-3 ${isOpen ? 'open' : 'closed'}`}>
                        {navData.map((item, i) => (
                            <li className='text-black' key={i}>
                                <Link
                                    to={`/${navLink[i]}`}
                                    className={isActive(navLink[i]) ? 'current' : ''}
                                    onClick={toggleMenu}
                                >
                                    {navData[i]}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar;

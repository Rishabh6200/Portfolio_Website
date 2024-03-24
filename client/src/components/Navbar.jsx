import React from 'react';
import '../assets/css/Navbar.css';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navData = ['Home', 'About', 'Resume', 'Projects', 'Contact'];
    const navLink = ['', 'about', 'resume', 'project', 'contact'];

    const location = useLocation();

    const isActive = (link) => {
        return location.pathname === `/${link}`;
    };

    return (
        <>
            <nav className="nav">
                <div className="nav-links">
                    <h1 className="logo">
                        <Link to='/' ><span>My</span> Website</Link>
                    </h1>
                    <ul>
                        {navData.map((item, i) => (
                            <li className='text-black' key={i}>
                                <Link
                                    to={`/${navLink[i]}`}
                                    className={isActive(navLink[i]) ? 'current' : ''}
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

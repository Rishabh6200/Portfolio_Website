import React from 'react'
import './SideNav.css'
import { Link, Outlet } from 'react-router-dom';
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { RiGraduationCapFill } from "react-icons/ri";
import { IoIosInformationCircle } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa";

const SideNav = () => {
    const navLink = ['', 'skill', 'education', 'detail', 'address']

    const dashLink = [
        {
            name: "Home",
            skillicon: AiFillHome,
        },
        {
            name: "Skills",
            skillicon: AiFillSetting,
        },
        {
            name: 'Education',
            skillicon: RiGraduationCapFill,
        },
        {
            name: 'Personal Info.',
            skillicon: IoIosInformationCircle,
        },
        {
            name: 'Address',
            skillicon: FaAddressCard,
        },
    ]

    return (
        <>
            <nav className='side-nav h-[92vh]'>
                <hr />
                <ul className='dash-links'>
                    {dashLink.map((item, i) => (
                        <Link to={navLink[i]} key={i} >
                            <li key={item.i} className='flex gap-3 mt-2'>
                                <item.skillicon size={25} />{item.name}
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

export default SideNav
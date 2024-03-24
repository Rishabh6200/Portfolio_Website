import React from 'react'
import SideNav from '../components/SideNav'
import Topnav from '../components/Topnav'

const DashboadLayout = () => {
    return (
        <>
            <div className="bg-white">
                <Topnav />
                <SideNav />
            </div>

        </>
    )
}

export default DashboadLayout
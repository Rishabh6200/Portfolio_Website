import React from 'react'
import Topnav from './TopNav/Topnav'
import SideNav from './SideNav/SideNav'

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
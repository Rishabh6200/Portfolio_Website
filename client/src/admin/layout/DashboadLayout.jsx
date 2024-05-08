import React from 'react'
import SideNav from './SideNav'
import Topnav from './Topnav'

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
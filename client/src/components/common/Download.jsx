import React from 'react'
import { FaDownload } from "react-icons/fa";

const Download = () => {

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = process.env.REACT_APP_URL + 'assets/download/mycv.pdf';
        link.download = 'mycv.pdf';
        link.target = '_blank';
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
    }
    return (
        <>
            <button className="bg-blue-900 hover:bg-blue-600 text-gray-800 font-bold
             py-3 px-14 rounded-lg inline-flex items-center gap-3"
                onClick={handleDownload}
            >
                <FaDownload size={20} color='#fff' />
                <span className='text-sm text-white'>Check CV</span>
            </button>
        </>
    )
}

export default Download
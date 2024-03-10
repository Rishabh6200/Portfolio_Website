import React from 'react'
import { FaDownload } from "react-icons/fa";

const Download = () => {

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = process.env.REACT_APP_URL + 'assets/download/mycv.pdf';
        link.download = 'mycv.pdf';
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
    }
    return (
        <>
            <button onClick={handleDownload}
                className='text-white relative flex top-14 left-80 bg-slate-900 p-3 gap-3 rounded-md'
            >
                <div className="mt-1">
                    <FaDownload />
                </div>
                Download CV
            </button>
        </>
    )
}

export default Download
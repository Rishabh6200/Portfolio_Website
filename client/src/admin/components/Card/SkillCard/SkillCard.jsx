import React from 'react'
import { TbEdit } from "react-icons/tb";
import { CiSquareRemove } from "react-icons/ci";


const SkillCard = ({ name, img }) => {
    return (
        <>
            <div className="block w-[18rem] rounded-lg bg-white text-surface shadow-xl border filter grayscale hover:grayscale-0 cursor-pointer hover:scale-105 transition">
                <div className="relative overflow-hidden bg-cover bg-no-repeat flex justify-center">
                    <img
                        className="rounded-t-lg p-3 h-32"
                        src={`${process.env.REACT_APP_SERVER_URL}images/${img}`}
                        alt="" />
                </div>
                <div className="p-4">
                    <p className="text-center font-mono text-xl">
                        {name}
                    </p>
                    <div className="flex justify-between text-xl mt-2 ">
                        <button className='hover:scale-110'>
                            <TbEdit size={30} />
                        </button>
                        <button className='hover:scale-110'>
                            <CiSquareRemove size={30} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SkillCard
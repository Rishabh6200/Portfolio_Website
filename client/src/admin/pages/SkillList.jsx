import React, { useEffect, useState } from 'react'
import '../assets/css/style.css'
import SkillCard from '../components/SkillCard'
import httpComman from '../../api/httpComman'
const SkillList = () => {
    const [skill, setSkill] = useState([]);

    const getSkill = async () => {
        const res = await httpComman.get('/skill')
        const apiData = res.data;
        setSkill(apiData)
    }
    console.log(skill)
    useEffect(() => {
        getSkill();
    }, [])

    return (
        <>
            <div className="admin-container">
                <div className="flex justify-center m-4 pb-4 border-b-2">
                    <h1 className='text-5xl font-semibold text-blue-800 border-4 border-blue-800 pb-3 px-7 rounded-xl'>My Skills</h1>
                </div>
                <div className="flex justify-center mt-4 p-5">
                    <div className="grid grid-cols-3 gap-9 gap-x-20">
                        {skill && skill.map((item, i) => (
                            <SkillCard img={item.skill_img} name={item.name} key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SkillList
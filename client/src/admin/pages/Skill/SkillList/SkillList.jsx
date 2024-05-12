import React, { useEffect, useState } from 'react'
import '../../../style/style.css'
import SkillCard from '../../../components/Card/SkillCard/SkillCard'
import httpComman from '../../../../api/httpComman'
import Heading from '../../../components/Heading/Heading'

const SkillList = () => {
    const [skill, setSkill] = useState([]);
    const getSkill = async () => {
        const res = await httpComman.get('/skill')
        const apiData = res.data;
        setSkill(apiData)
    }
    useEffect(() => {
        getSkill();
    }, [])

    return (
        <>
            <div className="admin-container">
                <Heading heading="My Skills" />
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
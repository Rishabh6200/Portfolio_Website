import React, { useEffect, useState } from 'react'
import '../assets/css/Skill.css'
import httpComman from '../api/httpComman'
import SkillBar from './SkillBar'
import PageHeading from '../components/PageHeading'

//--------images-----------
import html from '../assets/images/html.png'
import css from '../assets/images/css.png'
import js from '../assets/images/js.png'
import react from '../assets/images/react.png'
import node from '../assets/images/node.png'
import mongo from '../assets/images/mongo.png'



const Skills = () => {

    const [data, setData] = useState();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await httpComman.get('/skill');
                const apiData = res.data;
                setData(apiData)
            } catch (error) {
                console.log('Error fetching data:', error)
            }
        }
        fetchData();
    }, [])

    console.log('api data:', data)

    const img = [html, css, js, react, node, mongo]

    return (
        <>
            <div className="skill-page">
                <div className="skill-section">
                    <PageHeading heading='Skills' />
                </div>
                <div className="skill-detail">
                    {data && data.map((item, i) => (
                        <SkillBar img={img[i]} percentage={item.percentage} color={item.color} addclass='shek' />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Skills
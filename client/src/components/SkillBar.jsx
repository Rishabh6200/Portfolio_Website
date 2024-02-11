import React from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import '../assets/css/Skill.css'

const SkillBar = ({ img, percentage, color, addclass }) => {
  return (
    <>
      <div className="bar">
        <ProgressBar completed={percentage} bgColor={color} animateOnRender={true} isLabelVisible={false} className='ss' />
        <div className="skill-img">
          <img src={img} alt="" className={`${addclass}` } />
        </div>
      </div>
    </>
  )
}

export default SkillBar
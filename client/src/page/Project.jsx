import React from 'react'
import PageHeading from '../components/PageHeading'
import ProjectSection from '../components/ProjectSection'
import pokiImg from '../assets/images/9.png'
import '../assets/css/Project.css'

const Project = () => {

  const data = [
    {
      img: pokiImg,
      heading: 'Pokemon Characters Details',
      link: 'https://pokipro.netlify.app/',
    },
    {
      img: pokiImg,
      heading: 'Pokemon Characters Details',
      link: 'https://pokipro.netlify.app/',
    },
    {
      img: pokiImg,
      heading: 'Pokemon Characters Details',
      link: 'https://pokipro.netlify.app/',
    },
  ]



  return (
    <>
      <div className="project-box">
        <PageHeading heading={'My Projects'} />

        <div className="project-section">
          {data.map((item, i) => (
            <ProjectSection imgP={item.img} heading={item.heading} link={item.link} />
          ))}
        </div>
      </div>

    </>
  )
}

export default Project
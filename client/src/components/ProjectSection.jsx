import React from 'react'
import '../assets/css/Project.css'


const ProjectSection = ({ imgP, heading, link }) => {

  return (
    <>
      <div className='main-con'>
        <a href={link} target="_blank" >
          <div className="max-w-sm w-60  border-2 border-gray-200 rounded-lg shadow">
            <div className='img-box'>
              <img className="imgg rounded-t-lg p-2 h-40 m-auto" src={imgP} alt="" />
            </div>
            <div className="p-2 bg-white">
              <div>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{heading}</h5>
              </div>
              <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                Vist Website
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </div>
            </div>
          </div>
        </a>
      </div>
    </>
  )
}

export default ProjectSection
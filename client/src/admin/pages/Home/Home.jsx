import React from 'react'
import './Home.css'

const Home = () => {
  const data = [
    {
      name: 'Add Skill',
    },
    {
      name: 'Add Eduction',
    },
  ]

  return (
    <>
      <div className="cont">
        <h1 className='text-center text-4xl mt-5 text-blue-700 underline'>Welcome To DashBoard</h1>
        <div className="for-grid">
          {data.map((item, i) => (
            <div className={`col-one ${item.classA}`}>
              <h4 className='col-head text-white '>{item.name} </h4>
              <div className="arrow text-center mt-20">
                Go
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
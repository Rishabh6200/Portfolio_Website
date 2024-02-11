import React, { useEffect, useState } from 'react'
import '../assets/css/Resume.css'
import PageHeading from './PageHeading'
import httpcomman from '../api/httpComman'

const ResumeDetail = () => {
  const [data, setData] = useState();

  console.log(data)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await httpcomman.get('/resume');
        const apiData = res.data;
        setData(apiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [])


  return (
    <>
      <div className="resume">
        <PageHeading heading='RESUME' />
        <div className="res-box">
          <div className="main-box">
            <div className="box-one">
              <h1 className='eduction'>Eduction</h1>
              {data && data.map((item, i) => (
                <div className="edu-box flex gap-6">
                  <div className="d-box">
                    <Dot />
                    <Line />
                  </div>
                  <div className="edu-detail -m-1">
                    <h2>{item.degree}</h2>
                    <h4>{item.time}</h4>
                    <p>{item.college}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="box-two">
              <h1 className="eduction">Hobbies</h1>
              {data && data.map((item, i) => (
                <div className="edu-box flex gap-6">
                  <div className="d-box">
                    <Dot />
                    <div className="l"></div>
                  </div>
                  <div className="edu-detail -m-2">
                    <h2>{item.hobbie}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Dot = () => {
  return (
    <>
      <div className="dot"></div>
    </>
  )
}
const Line = () => {
  return (
    <>
      <div className="line"></div>
    </>
  )
}

export default ResumeDetail
export { Dot };
export { Line };
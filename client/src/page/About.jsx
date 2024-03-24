import React, { useEffect, useState } from 'react'
import '../assets/css/About.css'
import proImg from '../assets/images/mytransperant.png'
import PageHeading from '../components/PageHeading'
import httpComman from '../api/httpComman'


const About = () => {
  const [data, setData] = useState();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await httpComman.get('/about');
        const apiData = res.data;
        setData(apiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [])

  let detail;

  if (Array.isArray(data) && data.length > 0) {
    [{ detail }] = data;
  }


  return (
    <>
      <div className="conts">
        <div className="abs">
          
          <PageHeading heading='ABOUT' />

          <div className="container">

            <div className="pera">
              <p>{detail}
                <span>
                 - Thank you for visiting my portfolio!
                </span>
              </p>
            </div>
            <div className="img">
              <div className="box-img">
                <img src={proImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
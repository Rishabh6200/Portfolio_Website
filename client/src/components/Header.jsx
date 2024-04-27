import React, { useEffect, useState } from 'react'
import '../assets/css/Header.css'
import httpComman from '../api/httpComman'
import Download from './common/Download'
import Footer from './common/Footer'

const Header = () => {
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

  let name, prof;

  if (Array.isArray(data) && data.length > 0) {
    [{ name, prof }] = data;
  }

  return (
    <>
      <div id='headers' className="flex headers">
        <div className="outer-box w-1/2">
          <div className="wrapper mt-36">
            <div className="box h-full w-full p-6 rounded-lg text-white">
              <p className='text-4xl p-2 font-extrabold'>
                <span className='text-orange-500'>
                  Hello,
                </span>
                Everyone
              </p>
              <p className="text-6xl p-2 font-extrabold text-amber-300" >
                {name}
              </p>
              <p className='p-2 text-3xl'>
                {prof}
              </p>
              <div className="flex justify-start mt-10">
                <Download />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2" id='man-float'>
          <iframe
            title='man-float'
            src={process.env.REACT_APP_TEACH_IMG}
            className='h-full w-full'
          ></iframe>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Header
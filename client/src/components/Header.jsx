import React, { useEffect, useState } from 'react'
import '../assets/css/Header.css'
import httpComman from '../api/httpComman'
import Download from '../services/Download'

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
      <div className="headers">
        <div className="">
          <div className="to-blue text-white text-center">
            <p className='p1'>Hello, Everyone</p> <br />
            <p className='p2'>{name}</p>
            <p className='p3'>{prof}</p>
            <Download />
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import EductionCard from '../components/EducationCard'
import httpComman from '../../api/httpComman'

const EducationList = () => {
   const [education, setEduction] = useState([]);

   const getSkill = async () => {
      const res = await httpComman.get('/education')
      const apiData = res.data;
      setEduction(apiData)
   }
   useEffect(() => {
      getSkill();
   }, [])

   return (
      <>
         <div className="admin-container">
            <Heading heading="My Education" />
            <div className="flex justify-center mt-4 p-5">
               <div className="grid grid-cols-2 gap-9 gap-x-20">
                  {education && education.map((item, i) => (
                     <EductionCard name={item.name} college={item.college} time={item.time} key={i} />
                  ))}
               </div>
            </div>
         </div>
      </>
   )
}

export default EducationList
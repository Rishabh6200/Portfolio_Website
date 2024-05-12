import React from 'react'

const Heading = ({ heading }) => {
   return (
      <>
         <div className="flex justify-center m-4 pb-4 border-b-2">
            <h1 className='text-5xl font-semibold text-blue-800 border-4 border-blue-800 pb-3 px-7 rounded-xl'>{heading}</h1>
         </div>
      </>
   )
}

export default Heading
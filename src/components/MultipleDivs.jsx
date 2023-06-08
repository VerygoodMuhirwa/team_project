import React from 'react'
import divsData from '../data/Divs'

const MultipleDivs = () => {
  return (
    <div className='grid grid-cols-4 gap-7 mx-10 lg:static'>
      {divsData.map((divItem) => (
        <div key={divItem.id} className='flex flex-row bg-white px-7 py-3 w-[85%] rounded-xl gap-16 items-center h-[5rem]'>
          <div className='flex flex-col gap-[1%]'>
            <h3 className=' text-gray-700'>{divItem.title}</h3>
            <p className=' font-bold text-xl'>{divItem.value}</p>
          </div>
          <img src={divItem.img} alt={divItem.title} />
        </div>
      ))}
    </div>
  )
}

export default MultipleDivs
import React from 'react'
import searchIcon from '../assets/search.png'
import avatar from '../assets/avatar.png'
import notify from '../assets/notify.png'

const TopMenu = () => {
  return (
    <div className='p-10 flex flex-row justify-between items-center'>
       <p className='text-gray-700 font-bold text-[1.7rem]'>Welcome Admin!</p>

       <div className='flex flex-row gap-4 items-center'>
            <div className='flex flex-row'>
              <input type="text" placeholder='Search for courses...' className='p-2 rounded-lg text-sm w-[13rem] outline-none'/>
              <div className='relative z-20 w-10 right-8 top-[0.6rem]'>
                <img src={searchIcon} alt="search" className='absolute cursor-pointer'/>
              </div>
            </div>
            <div className=' bg-white p-2 rounded-xl'>
                <img src={notify} alt="bell" className=' cursor-pointer'/>
            </div>
            <div className='flex flex-row items-center'>
                <img src={avatar} alt="avatar" className=' cursor-pointer'/>
                <div className='flex flex-col text-sm font-bold pl-2'>
                    <p>Ryan Taylor</p>
                    <p className='text-blue-600'>Administrator</p>
                </div>
            </div>
       </div>

    </div>
  )
}

export default TopMenu
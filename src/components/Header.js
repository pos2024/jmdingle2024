import React from 'react'

const Header = () => {
  return (
    <div className='bg-[#4585e6] h-16 shadow-lg fixed top-0 right-0 z-50 w-full flex justify-between items-center px-4'>
    <div>
      <span className="text-white">Welcome, Owner!</span>
    </div>
    <div>
      <button 
        className='text-white font-semibold hover:text-gray-900 mr-4'
      
      >
        Logout
      </button>
      {/* Static content */}
      <button className="text-white font-semibold hover:text-gray-900">Settings</button>
      {/* Add more static content here if needed */}
    </div>
  </div>
  )
}

export default Header
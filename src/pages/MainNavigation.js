import React from 'react';
import { Link } from 'react-router-dom';

const MainNavigation = () => {
  return (
    <div className="bg-white min-h-screen w-64 flex flex-col">
      <div className="flex justify-center items-center h-16 bg-blue-700 text-white text-xl font-bold">
        Logo
      </div>
      <div className="flex-grow flex space-y-5 mt-5 flex-col">
        <Link to="/" className="text-black text-lg  px-4  hover:bg-gray-200 transition duration-300 ease-in-out">
          Home
        </Link>
        <Link to="/addcategories"className="text-black text-lg px-4  hover:bg-gray-200 transition duration-300 ease-in-out">
          Add Categories
        </Link>
        <Link to="/transfer" className="text-black text-lg px-4  hover:bg-gray-200 transition duration-300 ease-in-out">
          Transfer Product
        </Link>
        <Link to="/addproduct" className="text-black text-lg  px-4  hover:bg-gray-200 transition duration-300 ease-in-out">
          Add Product
        </Link>
        <Link to="/sales" className="text-black text-lg  px-4  hover:bg-gray-200 transition duration-300 ease-in-out">
         Sales Report
        </Link>
        {/* Add more links as needed */}
      </div>
    </div>
  );
};

export default MainNavigation;

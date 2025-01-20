import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBars, FaHome, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {token} = useSelector(state => state.auth)
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <header className="bg-gray-700 text-white p-4 flex justify-between items-center">
        <span className='flex gap-8 items-center'>
        <button className="text-white text-2xl" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to={'/'}>
            <FaHome size={25}/>
        </Link>
        </span>
        <nav className="flex px-6 text-white">
         {token ? <Link to="#" className="hover:text-red-400">Logout</Link> 
         :<Link to="/login" className="hover:text-green-400">Admin Login
         </Link>}
        </nav>
      </header>

      {/* Main Content */}
      <main className={`flex flex-1`}>
        <Sidebar sidebarOpen={sidebarOpen}/>
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;

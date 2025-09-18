import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      {/* Top Navbar */}
      <nav className="w-full min-h-14 flex items-center justify-between px-8 border-b border-gray-200">
        <img
          src={assets.logo}
          alt=""
          onClick={() => navigate('/')}
          className="cursor-pointer w-32 sm:w-44"
        />
        {sidebar ? (
          <X
            className="w-6 h-6 text-gray-600 sm:hidden"
            onClick={() => setSidebar(false)}
          />
        ) : (
          <Menu
            className="w-6 h-6 text-gray-600 sm:hidden"
            onClick={() => setSidebar(true)}
          />
        )}
      </nav>

      {/* Body */}
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
  {/* Sidebar - Desktop & Tablet (inline, no fixed) */}
  <div className="hidden sm:flex w-60">
    <Sidebar sidebar={true} setSidebar={setSidebar} />
  </div>

  {/* Sidebar - Mobile Overlay (fixed) */}
  <div className="sm:hidden">
    <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
  </div>

  {/* Main Content */}
  <div
    className="flex-1 bg-[#F4F7FB] transition-all duration-300"
  >
    <Outlet />
  </div>
</div>

    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  )
}

export default Layout

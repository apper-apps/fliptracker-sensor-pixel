import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNavigation from '@/components/molecules/BottomNavigation'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-20">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default Layout
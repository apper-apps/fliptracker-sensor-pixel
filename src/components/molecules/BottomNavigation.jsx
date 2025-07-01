import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BottomNavigation = () => {
  const location = useLocation()
  
  const navItems = [
    { 
      path: '/projects', 
      icon: 'FolderOpen', 
      label: 'Projects',
      exact: false 
    },
    {
      path: '/new-update',
      icon: 'Plus',
      label: 'New Update',
      isFab: true
    },
    { 
      path: '/timeline', 
      icon: 'Clock', 
      label: 'Timeline',
      exact: true 
    }
  ]
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.path 
            : location.pathname.startsWith(item.path) || (item.path === '/projects' && location.pathname === '/')
          
          if (item.isFab) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative"
              >
                <motion.div
                  className="bg-primary text-white rounded-full p-4 shadow-fab -mt-6"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <ApperIcon name={item.icon} className="w-6 h-6" />
                </motion.div>
              </NavLink>
            )
          }
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: navActive }) =>
                `flex flex-col items-center py-2 px-4 min-w-0 transition-colors ${
                  navActive || isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
              {(isActive) && (
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  layoutId="activeTab"
                />
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation
import React, { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa";


const Header = ({ onNavigateToRoll, onNavigateToBudget, onLogout, userData }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('userData')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else if (userData) {
      setUser(userData)
    }
  }, [userData])

  const userName = user?.name || user?.user?.name || user?.username || 'User'
  const userEmail = user?.email || user?.user?.email || 'User'

  return (
    <header className="bg-white shadow-md ">
      <div className="max-w-7xl mx-auto px-10 py-4 flex justify-between items-center">
        <nav>
          <ul className="flex items-center gap-10">
            <li>
              <button
                onClick={onNavigateToRoll}
                className="text-gray-800 text-lg font-medium hover:text-indigo-600 transition-colors cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-50"
              >
                Role
              </button>
            </li>
            <li>
              <button
                onClick={onNavigateToBudget}
                className="text-gray-800 text-lg font-medium hover:text-indigo-600 transition-colors cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-50"
              >
                Budget Management
              </button>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-right flex gap-2 items-center">
            <FaUserCircle className="w-8 h-8 text-gray-800" />
            <div>
              <p className="text-sm text-start font-medium text-gray-800">{userName}</p>
              <p className="text-xs text-gray-600">{userEmail}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header


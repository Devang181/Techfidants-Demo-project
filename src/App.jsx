import React, { useEffect, useState } from 'react'
import Login from './pages/login'
import UserRole from './pages/userRole'
import Addroll from './pages/Addroll'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem('currentPage') || 'userRole'
  )
  const [refreshKey, setRefreshKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // 🔐 Check auth on refresh
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('userData')

    if (token && storedUser) {
      setIsLoggedIn(true)
      setUserData(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  // ✅ Login success
  const handleLoginSuccess = (data) => {
    // 🔥 Token might be inside user object
    const token =
      data.token ||
      data.data?.token ||
      data.user?.token

    const user =
      data.user || data.data?.user || data

    if (!token) {
      console.error('Login response:', data)
      alert('Token not received from server')
      return
    }

    localStorage.setItem('token', token)
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.setItem('currentPage', 'userRole')

    setUserData(user)
    setIsLoggedIn(true)
    setCurrentPage('userRole')
  }

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    setUserData(null)
    setCurrentPage('userRole')
  }

  const handleNavigateToAddRole = () => {
    setCurrentPage('addroll')
    localStorage.setItem('currentPage', 'addroll')
  }

  const handleBackToRoles = () => {
    setCurrentPage('userRole')
    localStorage.setItem('currentPage', 'userRole')
  }

  const handleRoleAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : currentPage === 'addroll' ? (
        <Addroll onBack={handleBackToRoles} onRoleAdded={handleRoleAdded} />
      ) : (
        <UserRole
          key={refreshKey}
          userData={userData}
          onLogout={handleLogout}
          onNavigateToAddRole={handleNavigateToAddRole}
        />
      )}
    </>
  )
}

export default App

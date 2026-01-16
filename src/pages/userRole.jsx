import React, { useEffect, useState } from 'react'
import DeleteRoll from './DeleteRoll'
import UpdateRoll from './UpdateRoll'
import ViewRoll from './ViewRoll'
import Pagination from '../components/Pagination'

const ITEMS_PER_PAGE = 3 // Number of items per page

const UserRole = ({ userData, onNavigateToAddRole }) => {
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [roleToDelete, setRoleToDelete] = useState(null)
  const [roleToUpdate, setRoleToUpdate] = useState(null)
  const [roleToView, setRoleToView] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load user info
  useEffect(() => {
    const storedUser = localStorage.getItem('userData')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else if (userData) {
      setUser(userData)
    }
  }, [userData])

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Unauthorized: Token missing')
      }
      const skip = (currentPage - 1) * ITEMS_PER_PAGE
      const limit = ITEMS_PER_PAGE
      const response = await fetch(
        `https://techfidants-hrms-be.onrender.com/role/list?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roles')
      }

      const rolesArray = Array.isArray(data.data.roles)
        ? data.data.roles
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []

      setRoles(rolesArray)

      // Extract total pages from API response
      if (data.data?.totalCount || data.data?.total) {
        const totalCount = data.data.totalCount || data.data.total
        setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE))
      } else if (data.totalCount || data.total) {
        const totalCount = data.totalCount || data.total
        setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE))
      } else {
        // Fallback: if no total count, assume we have more pages if we got a full page
        if (rolesArray.length === ITEMS_PER_PAGE) {
          setTotalPages(currentPage + 1) // At least one more page
        } else {
          setTotalPages(currentPage) // This is the last page
        }
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [currentPage])

  const handleRoleDeleted = () => {
    fetchRoles()
    setRoleToDelete(null)
  }

  const handleRoleUpdated = () => {
    fetchRoles()
    setRoleToUpdate(null)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const userName = user?.name || user?.user?.name || user?.username || 'User'
  const userEmail = user?.email || user?.user?.email || 'User'
  
  const filteredRoles = roles.filter(role =>
    role.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading user information...</p>
      </div>
    )
  }

  if (roleToView) {
    return (
      <ViewRoll
        role={roleToView}
        onBack={() => setRoleToView(null)}
      />
    )
  }

  if (roleToUpdate) {
    return (
      <UpdateRoll
        role={roleToUpdate}
        onBack={() => setRoleToUpdate(null)}
        onRoleUpdated={handleRoleUpdated}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end items-center">
          <div className="text-right">
            <p className="text-sm text-start font-medium text-gray-800">{userName}</p>
            <p className="text-xs text-gray-600">{userEmail}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Roles Permission</h2>
        </div>

        {/* Search and Add Role Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 text-2xl font-bold text-gray-800">All Rolls</div>
            <div className="flex-1 w-full md:w-auto flex gap-2">
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={onNavigateToAddRole}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all whitespace-nowrap"
            >
              Add Role
            </button>
          </div>

          <div className="border-b border-gray-200 my-4"></div>

          <div className="p-6">
            {loading && <p>Loading roles...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="border border-gray-200">
                        <th className="text-left border border-gray-200 py-3 px-4 font-semibold text-gray-700 w-1/3">Roll Name</th>
                        <th className="text-left border border-gray-200 py-3 px-4 font-semibold text-gray-700 w-1/3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoles.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="text-center py-4">No roles found</td>
                        </tr>
                      ) : (
                        filteredRoles.map((role, index) => (
                          <tr key={role._id || index} className="border border-gray-200 hover:bg-gray-50">
                            <td className="border border-gray-200 py-3 px-4 text-gray-800 font-medium w-1/3">{role.roleName}</td>
                            <td className="border border-gray-200 py-3 px-4 w-1/3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setRoleToView(role)}
                                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-all cursor-pointer"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => setRoleToUpdate(role)}
                                  className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-all cursor-pointer"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => setRoleToDelete(role)}
                                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {roleToDelete && (
        <DeleteRoll
          role={roleToDelete}
          onClose={() => setRoleToDelete(null)}
          onRoleDeleted={handleRoleDeleted}
        />
      )}
    </div>
  )
}

export default UserRole

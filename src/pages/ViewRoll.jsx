import React, { useEffect, useState } from 'react'

const ViewRoll = ({ role, onBack }) => {
  const [allPermissions, setAllPermissions] = useState([]) // fetched from API
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]) // role's permission IDs
  const [loadingPermissions, setLoadingPermissions] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        if (!token) throw new Error('Unauthorized: Token missing')

        const response = await fetch(
          'https://techfidants-hrms-be.onrender.com/permission/list',
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || 'Failed to fetch permissions')
        }

        const data = await response.json()
        const permsArray = Array.isArray(data.data.permission) ? data.data.permission : []
        setAllPermissions(permsArray)

        if (role) {
          let selectedIds = []
          
          if (role.permissions) {
            // If role has permissions array
            selectedIds = permsArray
              .filter((perm) => {
                const permKey = perm.key || perm.value
                return role.permissions?.some((rolePerm) => {
                  if (typeof rolePerm === 'string') {
                    return rolePerm === permKey
                  }
                  return rolePerm.key === permKey || rolePerm.value === permKey
                })
              })
              .map((perm) => perm._id)
          } else if (role.permissionKeys) {
            // If role has permissionKeys array
            selectedIds = permsArray
              .filter((perm) => {
                const permKey = perm.key || perm.value
                return role.permissionKeys?.includes(permKey)
              })
              .map((perm) => perm._id)
          }
          
          setSelectedPermissionIds(selectedIds)
        }
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoadingPermissions(false)
      }
    }

    fetchPermissions()
  }, [token, role])

  if (!role) {
    return null
  }

  const roleName = role.roleName || role.name || 'Unknown Role'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">View Role</h2>

        <div className="space-y-6">
          {/* Role Name - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
              {roleName}
            </div>
          </div>

          {/* Permissions - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions ({selectedPermissionIds.length} selected)
            </label>
            
            {loadingPermissions ? (
              <p className="text-gray-500 text-sm">Loading permissions...</p>
            ) : error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : allPermissions.length === 0 ? (
              <p className="text-gray-500 text-sm">No permissions found</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                {allPermissions.map((perm) => {
                  const isSelected = selectedPermissionIds.includes(perm._id)
                  return (
                    <label
                      key={perm._id}
                      className={`flex items-center gap-2 p-2 rounded ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-not-allowed opacity-60"
                      />
                      <span className={isSelected ? 'font-medium' : ''}>
                        {perm.value || perm.key || perm.name || 'Unnamed Permission'}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              Back to Roles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewRoll


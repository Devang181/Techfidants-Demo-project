import React, { useEffect, useState } from 'react'

const UpdateRoll = ({ role, onBack, onRoleUpdated }) => {
  const [roleName, setRoleName] = useState('')
  const [permissions, setPermissions] = useState([]) // selected permission IDs
  const [allPermissions, setAllPermissions] = useState([]) // fetched from API
  const [loading, setLoading] = useState(false)
  const [loadingPermissions, setLoadingPermissions] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (role) {
      setRoleName(role.roleName || role.name || '')
    }
  }, [role])

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

        // 🔹 Set selected permissions based on role's existing permissions
        if (role && role.permissions) {
          // If role has permission keys, find matching permission IDs
          const selectedIds = permsArray
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
          setPermissions(selectedIds)
        } else if (role && role.permissionKeys) {
          // If role has permissionKeys array
          const selectedIds = permsArray
            .filter((perm) => {
              const permKey = perm.key || perm.value
              return role.permissionKeys?.includes(permKey)
            })
            .map((perm) => perm._id)
          setPermissions(selectedIds)
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

  const handlePermissionToggle = (permId) => {
    setPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!role || !role._id) {
      setError('Invalid role data')
      return
    }

    const trimmedRoleName = roleName.trim()
    if (!trimmedRoleName) return setError('Role name is required')

    const permissionKeys = permissions
      .map((permId) => {
        const perm = allPermissions.find((p) => p._id === permId)
        return perm?.key || perm?.value || null
      })
      .filter(Boolean)

    setLoading(true)
    try {
      const response = await fetch(
        `https://techfidants-hrms-be.onrender.com/role/update/${role._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roleName: trimmedRoleName,
            permissionKeys: permissionKeys || [],
          }),
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update role')

      setSuccess('Role updated successfully!')

      if (onRoleUpdated) onRoleUpdated()
      setTimeout(() => {
        if (onBack) onBack()
      }, 500)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!role) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 relative">
      {/* Success Notification - Bottom Right */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">{success}</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Update Role</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            {loadingPermissions ? (
              <p className="text-gray-500 text-sm">Loading permissions...</p>
            ) : allPermissions.length === 0 ? (
              <p className="text-gray-500 text-sm">No permissions found</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {allPermissions.map((perm) => (
                  <label key={perm._id} className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm._id)}
                      onChange={() => handlePermissionToggle(perm._id)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{perm.value || perm.key || perm.name || 'Unnamed Permission'}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || loadingPermissions}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateRoll


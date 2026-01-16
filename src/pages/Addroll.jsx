import React, { useEffect, useState } from 'react'

const Addroll = ({ onBack, onRoleAdded }) => {
  const [roleName, setRoleName] = useState('')
  const [permissions, setPermissions] = useState([]) // selected permission IDs
  const [allPermissions, setAllPermissions] = useState([]) // fetched from API
  const [loading, setLoading] = useState(false)
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
      } catch (err) {
        console.error(err)
        setError(err.message)
      }
    }

    fetchPermissions()
  }, [token])

  const handlePermissionToggle = (permId) => {
    setPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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
        'https://techfidants-hrms-be.onrender.com/role/add',
        {
          method: 'POST',
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
      if (!response.ok) throw new Error(data.message || 'Failed to add role')

      setSuccess('Role added successfully!')
      setRoleName('')
      setPermissions([])

      if (onRoleAdded) onRoleAdded()
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Role</h2>

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
            {allPermissions.length === 0 && <p className="text-gray-500 text-sm">No permissions found</p>}

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {allPermissions.map((perm) => (
                <label key={perm._id} className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm._id)}
                    onChange={() => handlePermissionToggle(perm._id)}
                    className="w-4 h-4"
                  />
                  {perm.value || perm.key}
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-600">{error}</p>}

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
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Addroll

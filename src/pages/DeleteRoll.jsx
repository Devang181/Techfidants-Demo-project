import React, { useState, useEffect } from 'react'

const DeleteRoll = ({ role, onClose, onRoleDeleted }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
        if (onClose) onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, onClose])

  const handleDelete = async () => {
    if (!role || !role._id) {
      setError('Invalid role data')
      return
    }

    setError('')
    setLoading(true)

    try {
      if (!token) {
        throw new Error('Unauthorized: Token missing. Please login again.')
      }

      const response = await fetch(
        `https://techfidants-hrms-be.onrender.com/role/delete/${role._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`)
      }

      if (!response.ok) {
        const errorMsg = data.message || data.error || `Server error: ${response.status}`
        throw new Error(errorMsg)
      }

      setSuccess('Role deleted successfully!')

      if (onRoleDeleted) {
        onRoleDeleted()
      }
    } catch (err) {
      console.error('Error deleting role:', err)
      setError(err.message || 'Failed to delete role. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose()
    }
  }

  if (!role) {
    return null
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 bg-opacity-50 z-40 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Delete Role</h2>
          </div>

          {/* Modal Body */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the role{' '}
              <span className="font-semibold text-gray-800">"{role.roleName || role.name}"</span>?
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete Role'
              )}
            </button>
          </div>
        </div>
      </div>

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
    </>
  )
}

export default DeleteRoll


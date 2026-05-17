// ProtectedRoute component: renders a focused piece of the Trello clone UI.
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'

//guard authenticated routes
function ProtectedRoute({ children, requiredRole }) {
  const navigate = useNavigate()
  const { isAuthenticated, authChecked, loading, checkAuth, currentUser } =
    useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (loading || !authChecked) return
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    if (requiredRole && currentUser?.role !== requiredRole) {
      navigate('/main-page', { replace: true })
    }
  }, [authChecked, loading, isAuthenticated, currentUser, requiredRole, navigate])

  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1d2125]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#579dff] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9fadbc] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null
  if (requiredRole && currentUser?.role !== requiredRole) return null

  return children
}

export default ProtectedRoute



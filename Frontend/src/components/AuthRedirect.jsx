import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function AuthRedirect() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const invite = params.get('invite')
    const target = invite ? `/login?invite=${invite}` : '/login'
    navigate(target, { replace: true })
  }, [location.search, navigate])

  return null
}

export default AuthRedirect

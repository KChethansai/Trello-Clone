// Register component: renders a focused piece of the Trello clone UI.
import { useForm } from 'react-hook-form'
import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaGoogle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../store/authStore'
import { API_BASE_URL, GOOGLE_CLIENT_ID } from '../config/api'
import {
  loginContainer,
  loginBox,
  loginInput,
  loginBtn,
  errorClass
} from '../Styles/common'


// Inline Trello logo - no external CDN dependency
const TRELLO_LOGO =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAXVBMVEUygs3///8Wecrk7PefvuMkfcve6PUee8vB1u7F2e/O4PLK3PAsgMxgmtb6/P4pfsypx+jr8/qPteCWuuM8iNCwy+l4qNsQd8pTldXY5fSJst9GjtJuo9nm7/mnxOazNwU+AAAB1ElEQVR4nO3d3VLiMBiA4VItoVIsPyrgut7/Za7uerAn0GQMnc+Z57mAb/JOA2dJmgYAAAAAAAAAAAAAAOD2hpTaDKkbcoZ1ecNSzrA6hrTZnpcZ1oenNDktPR3WOcPO281cjcPQL3I97tuJae3hMXtan7UnKgTuspf0YXv9K3bPJcN2wxyJaV2ypsXiZbwybHwpG9ZPbYkKxk3Zmha745Vpx6L98GFz+4+YirbVp9PlRQ2n0mHP039d39WeSxe1v7xNu33psPPtt2l7V7qo++5y4X3psDuFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFP7pwfC0d9tPOzAy/SodNHPYLV9gcl4XDZji7Vrew9KzfHOcP6xY2XdEvcTnHMdnKhU16+509adXMcUi2dmEzDm/vq//1/6y/PHxZv5/mOctdvbAZxpRnprPq9QujUagwPoUK41OoMD6FCuNTqDA+hQrjU6gwPoUK41OoMD6FCuNTqDC+qvcIh1T1LuiQ6t7nHVLKv1X/r6t3sodU9179mLpVdt/02wghfb5v8ZDzJEWf875FTFXfKAEAAAAAAAAAAAAAAAjlD7dCOFY7T154AAAAAElFTkSuQmCC'

function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const inviteToken = new URLSearchParams(location.search).get('invite')
  const prefillEmail = location.state?.email || ''
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { email: prefillEmail } })

  useEffect(() => {
    document.body.style.backgroundColor = '#f5f5f7'
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])

  // Google

  const handleGoogleCredential = useCallback(
    async (response) => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/oauth/google`,
          { credential: response.credential },
          { withCredentials: true }
        )
        const user = res.data.payload
        setUser(user)
        toast.success(`Welcome, ${user.name}!`)

        // if there's an invite token, accept it
        if (inviteToken) {
          try {
            await axios.post(
              `${API_BASE_URL}/api/invitations/accept`,
              { token: inviteToken },
              { withCredentials: true }
            )
            toast.success('Invitation accepted')
          } catch (err) {
            toast.error('Could not accept invitation')
          }
        }

        navigate('/main-page', { replace: true })
      } catch (err) {
        toast.error(err.response?.data?.message || 'Google sign-up failed')
      }
    },
    [navigate, setUser]
  )

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !window.google) return
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential
    })
    window.google.accounts.id.renderButton(
      document.getElementById('google-register-btn'),
      { theme: 'outline', size: 'large', width: 320, text: 'signup_with' }
    )
  }, [handleGoogleCredential])

  // Email / password

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password
      }
      const res = await axios.post(`${API_BASE_URL}/auth/register`, payload, {
        withCredentials: true
      })
      if (res.status === 201) {
        toast.success('Account created! Please log in.')
        navigate(`/login${inviteToken ? `?invite=${inviteToken}` : ''}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className={loginContainer}>
      {GOOGLE_CLIENT_ID && (
        <script src="https://accounts.google.com/gsi/client" async defer />
      )}
      <form className={loginBox} onSubmit={handleSubmit(onSubmit)}>
        {/* logo - inline base64, no external dependency */}
        <div className="flex justify-center mb-2">
          <img className="w-10 h-10" src={TRELLO_LOGO} alt="Trello" />
        </div>

        <h2 className="text-center text-xl font-bold text-[#1d1d1f] mb-1">
          Sign up
        </h2>
        <p className="text-center text-xs text-[#6e6e73] mb-4">
          Create your free Trello account
        </p>

        {/* full name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#6e6e73]">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className={loginInput}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#6e6e73]">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={loginInput}
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#6e6e73]">Password</label>
          <input
            type="password"
            placeholder="Min 8 characters"
            className={loginInput}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' }
            })}
          />
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        {/* confirm password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#6e6e73]">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="********"
            className={loginInput}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) =>
                val === watch('password') || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && (
            <p className={errorClass}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" className={loginBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Continue'}
        </button>

        <div className="relative flex items-center my-2">
          <div className="grow border-t border-[#e5e5ea]" />
          <span className="mx-3 text-xs text-[#a1a1a6]">or sign up with</span>
          <div className="grow border-t border-[#e5e5ea]" />
        </div>

        {/* Google */}
        {GOOGLE_CLIENT_ID ? (
          <div id="google-register-btn" className="flex justify-center" />
        ) : (
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-[#d2d2d7] rounded-full py-2.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors w-full"
            disabled
          >
            <FaGoogle className="text-red-400" /> Google (set
            VITE_GOOGLE_CLIENT_ID to enable)
          </button>
        )}

        <div className="flex justify-center text-xs mt-3">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => navigate('/login')}
          >
            Already have an account? Log in
          </button>
        </div>
      </form>
    </div>
  )
}

export default Register



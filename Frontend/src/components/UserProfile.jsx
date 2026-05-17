// UserProfile component: renders a focused piece of the Trello clone UI.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { BsPencil, BsCamera, BsX, BsLock } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useAuth } from '../store/authStore'

function UserProfile() {
  const navigate = useNavigate()
  const { currentUser, updateProfile, changePassword, checkAuth } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPwForm, setShowPwForm] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const {
    register: pwRegister,
    handleSubmit: pwHandleSubmit,
    reset: pwReset,
    watch: pwWatch,
    formState: { errors: pwErrors }
  } = useForm()

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        username: currentUser.username || ''
      })
    }
  }, [currentUser, reset])

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      await updateProfile(data)
      await checkAuth()
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      setPwSaving(true)
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      })
      toast.success('Password changed!')
      setShowPwForm(false)
      pwReset()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPwSaving(false)
    }
  }

  const handleCancel = () => {
    reset({
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      username: currentUser?.username || ''
    })
    setEditing(false)
  }

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-end">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => navigate('/main-page')}
      />

      {/* panel */}
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5ea] shrink-0">
          <h2 className="text-base font-bold text-[#1d1d1f]">Profile</h2>
          <button
            onClick={() => navigate('/main-page')}
            className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
          >
            <BsX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-6">
          {/* avatar section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-3">
              <div className="w-24 h-24 bg-[#579dff] rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {currentUser?.profilePic ? (
                  <img
                    src={currentUser.profilePic}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(currentUser?.name)}</span>
                )}
              </div>
              {editing && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#579dff] hover:bg-[#85b8ff] rounded-full flex items-center justify-center text-white transition-colors shadow-md"
                >
                  <BsCamera className="text-xs" />
                </button>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#1d1d1f]">
              {currentUser?.name || 'Trello User'}
            </h3>
            <p className="text-sm text-[#6e6e73]">{currentUser?.email}</p>
            <span className="text-xs bg-[#579dff]/10 text-[#579dff] px-2 py-0.5 rounded-full mt-1.5 font-medium">
              {currentUser?.role || 'VIEWER'}
            </span>
          </div>

          <div className="border-t border-[#f2f2f7] mb-6" />

          {/* about me */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-[#1d1d1f]">About Me</p>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                >
                  <BsPencil className="text-xs" /> Edit
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* full name */}
              <div>
                <label className="text-xs font-medium text-[#6e6e73] block mb-1">
                  Full Name
                </label>
                <input
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${
                    editing
                      ? 'border-[#d2d2d7] focus:border-[#0066cc] bg-white text-[#1d1d1f]'
                      : 'border-transparent bg-[#f5f5f7] text-[#1d1d1f] cursor-default'
                  }`}
                  disabled={!editing}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* username */}
              <div>
                <label className="text-xs font-medium text-[#6e6e73] block mb-1">
                  Username
                </label>
                <input
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${
                    editing
                      ? 'border-[#d2d2d7] focus:border-[#0066cc] bg-white text-[#1d1d1f]'
                      : 'border-transparent bg-[#f5f5f7] text-[#1d1d1f] cursor-default'
                  }`}
                  disabled={!editing}
                  placeholder="@yourhandle"
                  {...register('username')}
                />
              </div>

              {/* bio */}
              <div>
                <label className="text-xs font-medium text-[#6e6e73] block mb-1">
                  Bio
                </label>
                <textarea
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors resize-none ${
                    editing
                      ? 'border-[#d2d2d7] focus:border-[#0066cc] bg-white text-[#1d1d1f]'
                      : 'border-transparent bg-[#f5f5f7] text-[#1d1d1f] cursor-default'
                  }`}
                  rows={3}
                  disabled={!editing}
                  placeholder="Tell your team a bit about yourself..."
                  {...register('bio')}
                />
              </div>

              {/* email - read-only */}
              <div>
                <label className="text-xs font-medium text-[#6e6e73] block mb-1">
                  Email
                </label>
                <input
                  className="w-full border-transparent bg-[#f5f5f7] rounded-xl px-3 py-2.5 text-sm text-[#1d1d1f] cursor-default"
                  disabled
                  value={currentUser?.email || ''}
                  readOnly
                />
                <p className="text-xs text-[#6e6e73] mt-1">
                  Email can only be changed from your Atlassian account.
                </p>
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0066cc] hover:bg-[#0055b3] disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-full text-sm transition-colors"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-[#d2d2d7] text-[#1d1d1f] font-medium px-5 py-2 rounded-full text-sm hover:bg-[#f5f5f7] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>

        {/* change password section */}
        <div className="px-6 pb-8 border-t border-[#f2f2f7]">
          <div className="flex items-center justify-between mt-6 mb-4">
            <p className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
              <BsLock className="text-xs" /> Security
            </p>
            {!showPwForm && (
              <button
                onClick={() => setShowPwForm(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                Change password
              </button>
            )}
          </div>

          {showPwForm && (
            <form
              onSubmit={pwHandleSubmit(onPasswordSubmit)}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-medium text-[#6e6e73] block mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  className="w-full border border-[#d2d2d7] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0066cc]"
                  {...pwRegister('oldPassword', { required: 'Required' })}
                />
                {pwErrors.oldPassword && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {pwErrors.oldPassword.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-[#6e6e73] block mb-1">
                  New password
                </label>
                <input
                  type="password"
                  className="w-full border border-[#d2d2d7] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0066cc]"
                  {...pwRegister('newPassword', {
                    required: 'Required',
                    minLength: { value: 8, message: 'Minimum 8 characters' }
                  })}
                />
                {pwErrors.newPassword && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {pwErrors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-[#6e6e73] block mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  className="w-full border border-[#d2d2d7] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0066cc]"
                  {...pwRegister('confirmPassword', {
                    required: 'Required',
                    validate: (v) =>
                      v === pwWatch('newPassword') || 'Passwords do not match'
                  })}
                />
                {pwErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {pwErrors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={pwSaving}
                  className="bg-[#0066cc] hover:bg-[#0055b3] disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-full text-sm transition-colors"
                >
                  {pwSaving ? 'Saving...' : 'Update password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPwForm(false)
                    pwReset()
                  }}
                  className="border border-[#d2d2d7] text-[#1d1d1f] font-medium px-5 py-2 rounded-full text-sm hover:bg-[#f5f5f7] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile



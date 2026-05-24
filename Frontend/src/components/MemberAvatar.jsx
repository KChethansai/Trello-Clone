import {
  getAvatarGradient,
  getInitials,
  getMemberDisplayName
} from '../utils/projectUtils'

const sizeStyles = {
  xs: 'h-5 w-5 text-[9px] ring-[1.5px]',
  sm: 'h-7 w-7 text-[10px] ring-2',
  md: 'h-8 w-8 text-xs ring-2',
  lg: 'h-10 w-10 text-sm ring-2'
}

export default function MemberAvatar({
  member,
  size = 'sm',
  className = '',
  title
}) {
  const label = getMemberDisplayName(member)
  const initials = getInitials(label)
  const gradient = getAvatarGradient(label)
  const sizeClass = sizeStyles[size] || sizeStyles.sm
  const baseClass = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-semibold leading-none text-white shadow-md ring-white/20 ${sizeClass}`

  if (member?.profilePic) {
    return (
      <img
        src={member.profilePic}
        alt=""
        title={title ?? label}
        className={`${baseClass} object-cover ${className}`}
      />
    )
  }

  return (
    <span
      title={title ?? label}
      className={`${baseClass} ${gradient} ${className}`}
      aria-hidden={title ? undefined : true}
    >
      {initials}
    </span>
  )
}

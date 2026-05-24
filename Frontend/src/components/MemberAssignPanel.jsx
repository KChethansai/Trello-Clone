import { BsCheckLg } from 'react-icons/bs'
import {
  dashboardBorderColor,
  dashboardMutedColor,
  dashboardSurfaceColor,
  dashboardTextColor,
  modalActionBtn
} from '../Styles/common'
import { getId, getMemberDisplayName } from '../utils/projectUtils'
import MemberAvatar from './MemberAvatar'

export default function MemberAssignPanel({
  memberList,
  assignedMemberIds = [],
  assignedMembers = [],
  readOnly,
  onToggleMember
}) {
  const assignedSet = new Set(assignedMemberIds)

  if (readOnly) {
    if (assignedMembers.length === 0) {
      return (
        <p className={`px-2 py-1 text-xs ${dashboardMutedColor}`}>
          No members assigned.
        </p>
      )
    }
    return (
      <ul className="space-y-2">
        {assignedMembers.map((member) => (
          <li
            key={getId(member)}
            className={`flex items-center gap-2 rounded-lg border ${dashboardBorderColor} bg-white/[0.03] p-2`}
          >
            <MemberAvatar member={member} size="md" />
            <div className="min-w-0">
              <p className={`truncate text-sm font-medium ${dashboardTextColor}`}>
                {getMemberDisplayName(member)}
              </p>
              {member.email && (
                <p className={`truncate text-xs ${dashboardMutedColor}`}>
                  {member.email}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="space-y-3">
      <p className={`text-xs ${dashboardMutedColor}`}>
        Select teammates, then click Save. Cancel discards changes.
      </p>

      {assignedMembers.length > 0 && (
        <ul className="space-y-1.5">
          {assignedMembers.map((member) => {
            const memberId = getId(member)
            return (
              <li
                key={memberId}
                className="flex items-center gap-2 rounded-lg border border-[#ff4d67]/30 bg-[#ff4d67]/8 p-2"
              >
                <MemberAvatar member={member} size="sm" />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${dashboardTextColor}`}
                  >
                    {getMemberDisplayName(member)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleMember(memberId)}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-[#ff8aa0] transition-colors hover:bg-white/10 hover:text-[#ff4d67]"
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {memberList.length === 0 ? (
        <p className={`text-xs ${dashboardMutedColor}`}>No members available.</p>
      ) : (
        <ul
          className={`max-h-52 space-y-1 overflow-y-auto rounded-lg border ${dashboardBorderColor} ${dashboardSurfaceColor} p-1.5 app-scrollbar`}
        >
          {memberList.map((member) => {
            const memberId = getId(member)
            const isAssigned = assignedSet.has(memberId)
            return (
              <li key={memberId}>
                <button
                  type="button"
                  onClick={() => onToggleMember(memberId)}
                  className={`${modalActionBtn} w-full justify-between gap-2 ${
                    isAssigned
                      ? 'border border-[#ff4d67]/35 bg-[#ff4d67]/10'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <MemberAvatar member={member} size="xs" />
                    <span className="min-w-0 truncate text-left">
                      {member.name || member.email}
                    </span>
                  </span>
                  {isAssigned && (
                    <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#ff4d67]">
                      <BsCheckLg className="text-xs" />
                      Selected
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

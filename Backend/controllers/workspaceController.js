// workspaceController controller: request handlers and domain-side persistence logic.
import crypto from 'crypto'
import { WorkspaceModel } from '../models/Workspace.js'
import { UserModel } from '../models/usermodel.js'
import InvitationModel from '../models/Invitation.js'
import { createActivity } from './ActivityController.js'
import { sendEmail } from '../utils/email.js'
import { env } from '../config/env.js'
import { createNotification } from './notificationController.js'

const normalizeWorkspaceRole = (role) => {
  const upper = role?.toString().trim().toUpperCase()
  return ['ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'].includes(upper) ? upper : 'MEMBER'
}

const normalizeInvitationRole = (role) => {
  const upper = normalizeWorkspaceRole(role)
  return upper[0] + upper.slice(1).toLowerCase()
}

const getWorkspaceInviteUrl = (token) => {
  const baseUrl = env.clientUrls[0] || 'http://localhost:5173'
  return `${baseUrl}/auth?invite=${token}`
}

const buildInvitationEmail = ({ inviterName, workspaceName, inviteUrl, role }) => {
  const subject = `You are invited to join ${workspaceName}`
  const text = `Hello,

${inviterName} invited you to join the workspace "${workspaceName}" as a ${role}.

To accept the invitation, open the following link:
${inviteUrl}

If you don't have an account yet, sign up using this email address.

This invitation expires in 7 days.

Thanks,
Your Team Workspace App`
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2937;">
  <h2 style="color:#111827;">Workspace Invitation</h2>
  <p><strong>${inviterName}</strong> invited you to join the workspace <strong>${workspaceName}</strong> as a <strong>${role}</strong>.</p>
  <p>Click the button below to accept the invitation:</p>
  <a href="${inviteUrl}" style="display:inline-block;padding:12px 20px;margin:12px 0;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">Accept Invitation</a>
  <p>If the button does not work, copy and paste this link into your browser:</p>
  <p><a href="${inviteUrl}" style="word-break:break-all;color:#2563eb;">${inviteUrl}</a></p>
  <p>This invitation expires in 7 days.</p>
  <p>Thanks,<br/>Your Team Workspace App</p>
</div>`
  return { subject, text, html }
}

const buildMemberAddedEmail = ({ inviterName, workspaceName, role }) => {
  const subject = `You have been added to ${workspaceName}`
  const text = `Hello,

${inviterName} added you to the workspace "${workspaceName}" as a ${role}.

Log in to view the workspace and start collaborating.

Thanks,
Your Team Workspace App`
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2937;">
  <h2 style="color:#111827;">Workspace Access Granted</h2>
  <p><strong>${inviterName}</strong> added you to the workspace <strong>${workspaceName}</strong> as a <strong>${role}</strong>.</p>
  <p>Log in to your account to view the workspace and start collaborating.</p>
  <p>Thanks,<br/>Your Team Workspace App</p>
</div>`
  return { subject, text, html }
}

//create workspace - owner set from JWT so client doesn't need to send it
export const createWorkspace = async (req, res, next) => {
  try {
    const { name, members } = req.body
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Workspace name is required' })
    }

    const workspace = await WorkspaceModel.create({
      name: name.trim(),
      owner: req.user.id,
      members: [
        { user: req.user.id, role: 'ADMIN' },
        ...(Array.isArray(members) ? members : [])
      ]
    })

    res.status(201).json({ message: 'Workspace created', payload: workspace })
  } catch (err) {
    next(err)
  }
}

//get all workspaces for logged-in user
export const getWorkspaces = async (req, res, next) => {
  try {
    const userId = req.user.id
    const workspaces = await WorkspaceModel.find({
      $or: [{ 'members.user': userId }, { owner: userId }]
    })
      .populate('owner', 'name email')
      .populate('members.user', 'name email profilePic')

    res.status(200).json({ message: 'Workspaces fetched', payload: workspaces })
  } catch (err) {
    next(err)
  }
}

//get single workspace
export const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email profilePic')

    if (!workspace)
      return res.status(404).json({ message: 'Workspace not found' })

    const userId = req.user.id
    const isMember = workspace.members.some(
      (m) => m.user?._id?.toString() === userId
    )
    const isOwner = workspace.owner._id.toString() === userId

    if (!isMember && !isOwner) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.status(200).json({ message: 'Workspace fetched', payload: workspace })
  } catch (err) {
    next(err)
  }
}

//update workspace
export const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id)
    if (!workspace)
      return res.status(404).json({ message: 'Workspace not found' })

    const userId = req.user.id
    const member = workspace.members.find((m) => m.user?.toString() === userId)
    const isOwner = workspace.owner.toString() === userId
    const isAdmin = member?.role === 'ADMIN'
    const isManager = member?.role === 'MANAGER'

    // Only owner or ADMIN can rename the workspace
    if (req.body.name && !isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only Admin or owner can rename the workspace' })
    }

    // Owner, ADMIN, or MANAGER can update member roles
    if (req.body.members && !isOwner && !isAdmin && !isManager) {
      return res.status(403).json({ message: 'Only Admin, Manager, or owner can update member roles' })
    }

    if (!isOwner && !isAdmin && !isManager) {
      return res.status(403).json({ message: 'Only Admin or owner can update the workspace' })
    }

    if (req.body.name) workspace.name = req.body.name.trim()
    if (req.body.members) {
      workspace.members = req.body.members.map((m) => {
        const targetUserId = String(m.user?._id || m.user)
        const isOwnerUser = String(workspace.owner) === targetUserId
        const newRole = (m.role || 'MEMBER').toUpperCase()
        return {
          user: targetUserId,
          role: newRole === 'ADMIN' && !isOwnerUser ? 'MEMBER' : newRole
        }
      })
    }
    const updated = await workspace.save()

    res.status(200).json({ message: 'Workspace updated', payload: updated })
  } catch (err) {
    next(err)
  }
}

//delete workspace
export const deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id)
    if (!workspace)
      return res.status(404).json({ message: 'Workspace not found' })

    const userId = req.user.id
    const member = workspace.members.find((m) => m.user?.toString() === userId)
    const isOwner = workspace.owner.toString() === userId

    if (!isOwner && member?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admin or owner can delete' })
    }

    await workspace.deleteOne()
    res.status(200).json({ message: 'Workspace deleted' })
  } catch (err) {
    next(err)
  }
}

//add member - looks up user by email if userId not provided
export const addMember = async (req, res, next) => {
  try {
    const { userId, email, role } = req.body

    if (role?.toString().trim().toUpperCase() === 'ADMIN') {
      return res.status(400).json({ message: 'Collaborators cannot be admins' })
    }

    const workspace = await WorkspaceModel.findById(req.params.id)
    if (!workspace)
      return res.status(404).json({ message: 'Workspace not found' })

    const currentUserId = req.user.id
    const currentMember = workspace.members.find(
      (m) => m.user?.toString() === currentUserId
    )
    const isOwner = workspace.owner.toString() === currentUserId

    if (!isOwner && !['ADMIN', 'MANAGER', 'MEMBER'].includes(currentMember?.role)) {
      return res
        .status(403)
        .json({ message: 'Only workspace members can invite users' })
    }

    const normalizedEmail = email?.toLowerCase().trim()
    let targetUser = null

    if (userId) {
      targetUser = await UserModel.findById(userId)
      if (!targetUser)
        return res.status(404).json({ message: 'User not found' })
    } else if (normalizedEmail) {
      targetUser = await UserModel.findOne({ email: normalizedEmail })
    }

    const invitationRole = normalizeInvitationRole(role)
    const workspaceRole = normalizeWorkspaceRole(role)

    if (!targetUser && !normalizedEmail)
      return res.status(400).json({ message: 'userId or email required' })

    const targetEmail = targetUser ? targetUser.email.toLowerCase().trim() : normalizedEmail

    if (targetUser) {
      const targetUserId = targetUser._id.toString()
      const alreadyMember = workspace.members.some(
        (m) => m.user?.toString() === targetUserId
      )
      if (alreadyMember)
        return res.status(400).json({ message: 'User is already a member' })
    }

    // Always create an invitation
    const existingInvitation = await InvitationModel.findOne({
      email: targetEmail,
      workspace: workspace._id
    })

    const token = crypto.randomBytes(24).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    if (existingInvitation) {
      existingInvitation.token = token
      existingInvitation.expiresAt = expiresAt
      existingInvitation.role = invitationRole
      await existingInvitation.save()
    } else {
      await InvitationModel.create({
        email: targetEmail,
        workspace: workspace._id,
        role: invitationRole,
        token,
        expiresAt
      })
    }

    const inviter = await UserModel.findById(req.user.id).select('name email')
    const inviteUrl = getWorkspaceInviteUrl(token)
    const emailInfo = buildInvitationEmail({
      inviterName: inviter?.name || inviter?.email || 'A teammate',
      workspaceName: workspace.name,
      inviteUrl,
      role: invitationRole
    })

    let emailWarning = null
    try {
      await sendEmail({
        to: targetEmail,
        subject: emailInfo.subject,
        text: emailInfo.text,
        html: emailInfo.html
      })
    } catch (emailError) {
      console.error('Failed to send workspace invitation email:', emailError)
      emailWarning =
        'Invitation was created, but email could not be sent because SMTP is not configured.'
    }

    await createActivity({
      actor: req.user.id,
      action: 'INVITE_SENT',
      target: workspace._id,
      targetModel: 'Workspace',
      project: null
    }).catch(() => {})

    // Send in-website notification if the user exists
    if (targetUser) {
      await createNotification({
        userId: targetUser._id,
        senderId: req.user.id,
        message: `${inviter?.name || inviter?.email || 'A teammate'} invited you to join the workspace "${workspace.name}" as a ${workspaceRole}`,
        type: 'member',
        readLink: `/auth?invite=${token}`
      }).catch((err) => {
        console.error('Failed to create in-app workspace notification:', err)
      })
    }

    return res.status(200).json({
      message: 'Invitation sent',
      warning: emailWarning
    })
  } catch (err) {
    next(err)
  }
}

//remove member
export const removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params
    const workspace = await WorkspaceModel.findById(id)
    if (!workspace)
      return res.status(404).json({ message: 'Workspace not found' })

    const currentUserId = req.user.id
    const currentMember = workspace.members.find(
      (m) => m.user?.toString() === currentUserId
    )
    const isOwner = workspace.owner.toString() === currentUserId

    //allow: owner, admin, manager, or self-removal
    if (
      !isOwner &&
      currentMember?.role !== 'ADMIN' &&
      currentMember?.role !== 'MANAGER' &&
      currentUserId !== userId
    ) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    //prevent removing the owner
    if (workspace.owner.toString() === userId) {
      return res
        .status(400)
        .json({ message: 'Cannot remove the workspace owner' })
    }

    workspace.members = workspace.members.filter(
      (m) => m.user?.toString() !== userId
    )
    await workspace.save()

    await createActivity({
      actor: req.user.id,
      action: 'MEMBER_REMOVED',
      target: workspace._id,
      targetModel: 'Workspace',
      project: null
    }).catch(() => {})

    res.status(200).json({ message: 'Member removed' })
  } catch (err) {
    next(err)
  }
}

// accept invitation: user must be authenticated and email must match invitation
export const acceptInvitation = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token
    if (!token) return res.status(400).json({ message: 'Invitation token required' })

    const invitation = await InvitationModel.findOne({ token })
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' })
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invitation has expired' })
    }

    const user = await UserModel.findById(req.user.id)
    if (!user) return res.status(401).json({ message: 'Authentication required' })

    if (user.email.toLowerCase().trim() !== invitation.email.toLowerCase().trim()) {
      return res.status(403).json({ message: 'This invitation is for a different email' })
    }

    const workspace = await WorkspaceModel.findById(invitation.workspace)
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' })

    const alreadyMember = workspace.members.some(
      (m) => m.user?.toString() === user._id.toString()
    )
    if (alreadyMember) {
      await InvitationModel.deleteOne({ _id: invitation._id }).catch(() => {})
      return res.status(200).json({ message: 'Already a member' })
    }

    // add as viewer by default (or honor invitation role)
    let role = (invitation.role || 'Member').toString().toUpperCase()
    if (role === 'ADMIN') {
      role = 'MEMBER'
    }
    workspace.members.push({ user: user._id.toString(), role })
    await workspace.save()

    await InvitationModel.deleteOne({ _id: invitation._id }).catch(() => {})

    await createActivity({
      actor: user._id,
      action: 'INVITE_ACCEPTED',
      target: workspace._id,
      targetModel: 'Workspace',
      project: null
    }).catch(() => {})

    // Send in-website notification confirming acceptance
    await createNotification({
      userId: user._id,
      message: `You successfully joined the workspace "${workspace.name}" as a ${role}`,
      type: 'member',
      readLink: '/workspaces'
    }).catch((err) => {
      console.error('Failed to create workspace join notification:', err)
    })

    const populated = await WorkspaceModel.findById(workspace._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email profilePic')

    res.status(200).json({ message: 'Invitation accepted', payload: populated })
  } catch (err) {
    next(err)
  }
}



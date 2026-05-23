// notificationController controller: request handlers and domain-side persistence logic.
import { NotificationModel } from '../models/NotificationModel.js'
import { projectModel } from '../models/ProjectModel.js'
import { UserModel } from '../models/usermodel.js'
import { logger } from '../utils/logger.js'
import { getIO } from '../socket.js'

// ─── helpers ─────────────────────────────────────────────────────────────────

const emitToUser = (userId, event, data) => {
  try {
    getIO().to(`user:${userId}`).emit(event, data)
  } catch {
    // socket not yet initialised during tests
  }
}

// ─── GET /notifications ───────────────────────────────────────────────────────

export const getNotifications = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, parseInt(req.query.limit) || 30)

    const notifications = await NotificationModel.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'name email profilePic')
      .populate('project', 'name')
      .lean()

    res.status(200).json({ message: 'Notifications fetched', payload: notifications })
  } catch (err) {
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

// ─── PUT /notifications/read-all ─────────────────────────────────────────────

export const markAllRead = async (req, res) => {
  try {
    await NotificationModel.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    )
    res.status(200).json({ message: 'All marked as read' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

// ─── PUT /notifications/:id/read ─────────────────────────────────────────────

export const markOneRead = async (req, res) => {
  try {
    const notif = await NotificationModel.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!notif) return res.status(404).json({ message: 'Notification not found' })

    notif.read = true
    await notif.save()

    res.status(200).json({ message: 'Marked as read', payload: notif })
  } catch (err) {
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

// ─── DELETE /notifications/:id ────────────────────────────────────────────────

export const deleteNotification = async (req, res) => {
  try {
    await NotificationModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    })
    res.status(200).json({ message: 'Notification deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

// ─── POST /notifications/invite ───────────────────────────────────────────────
// Body: { projectId, recipientEmail }

export const sendInvite = async (req, res) => {
  try {
    const { projectId, recipientEmail } = req.body

    if (!projectId || !recipientEmail) {
      return res.status(400).json({ message: 'projectId and recipientEmail are required' })
    }

    // load project
    const project = await projectModel.findById(projectId)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    // only creator or existing member can invite
    const isOwner = project.creatorId?.toString() === req.user.id
    const isMember = project.members.map((m) => m.toString()).includes(req.user.id)
    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorised to invite to this project' })
    }

    // find recipient
    const recipient = await UserModel.findOne({ email: recipientEmail.toLowerCase().trim() })
    if (!recipient) return res.status(404).json({ message: 'User not found with that email' })

    // prevent self-invite
    if (recipient._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot invite yourself' })
    }

    // prevent inviting existing members
    const alreadyMember =
      project.creatorId?.toString() === recipient._id.toString() ||
      project.members.map((m) => m.toString()).includes(recipient._id.toString())

    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this project' })
    }

    // prevent duplicate pending invite
    const duplicate = await NotificationModel.findOne({
      user: recipient._id,
      project: projectId,
      type: 'invite',
      status: 'pending'
    })
    if (duplicate) {
      return res.status(400).json({ message: 'An invite is already pending for this user' })
    }

    // load sender info
    const sender = await UserModel.findById(req.user.id).select('name email')

    const message = `${sender.name} invited you to join "${project.name}"`

    const notification = await NotificationModel.create({
      user: recipient._id,
      sender: req.user.id,
      project: projectId,
      type: 'invite',
      status: 'pending',
      message,
      read: false
    })

    const populated = await notification.populate([
      { path: 'sender', select: 'name email profilePic' },
      { path: 'project', select: 'name' }
    ])

    // real-time push to recipient's user room
    emitToUser(recipient._id.toString(), 'new-notification', populated)

    res.status(201).json({ message: 'Invite sent', payload: populated })
  } catch (err) {
    logger.error('sendInvite error:', err.message)
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

// ─── POST /notifications/:id/accept ──────────────────────────────────────────

export const acceptInvite = async (req, res) => {
  try {
    const notif = await NotificationModel.findOne({
      _id: req.params.id,
      user: req.user.id,
      type: 'invite',
      status: 'pending'
    })

    if (!notif) return res.status(404).json({ message: 'Invite notification not found' })

    const project = await projectModel.findById(notif.project)
    if (!project) return res.status(404).json({ message: 'Project no longer exists' })

    // idempotent - skip if already member
    const alreadyMember = project.members.map((m) => m.toString()).includes(req.user.id)
    if (!alreadyMember) {
      project.members.push(req.user.id)
      await project.save()
    }

    notif.status = 'accepted'
    notif.read = true
    await notif.save()

    const populated = await notif.populate([
      { path: 'sender', select: 'name email profilePic' },
      { path: 'project', select: 'name' }
    ])

    // notify the project room so members see the new addition live
    try {
      getIO()
        .to(`project:${project._id}`)
        .emit('member-added', { userId: req.user.id, projectId: project._id })
    } catch { /* silent */ }

    res.status(200).json({ message: 'Invite accepted', payload: populated })
  } catch (err) {
    logger.error('acceptInvite error:', err.message)
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

// ─── POST /notifications/:id/reject ──────────────────────────────────────────

export const rejectInvite = async (req, res) => {
  try {
    const notif = await NotificationModel.findOne({
      _id: req.params.id,
      user: req.user.id,
      type: 'invite',
      status: 'pending'
    })

    if (!notif) return res.status(404).json({ message: 'Invite notification not found' })

    notif.status = 'rejected'
    notif.read = true
    await notif.save()

    res.status(200).json({ message: 'Invite rejected', payload: notif })
  } catch (err) {
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

// ─── Internal helper (called from other controllers) ─────────────────────────

export const createNotification = async ({ userId, message, type = 'default', readLink = '', senderId = null, projectId = null }) => {
  try {
    const notif = await NotificationModel.create({
      user: userId,
      sender: senderId || null,
      project: projectId || null,
      message,
      type,
      readLink
    })
    emitToUser(userId.toString(), 'new-notification', notif)
    return notif
  } catch (err) {
    logger.error('Notification create error:', err.message)
  }
}

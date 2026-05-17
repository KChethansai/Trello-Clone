// notificationController controller: request handlers and domain-side persistence logic.
import { NotificationModel } from '../models/NotificationModel.js'
import { logger } from '../utils/logger.js'

//get all notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)

    res
      .status(200)
      .json({ message: 'Notifications fetched', payload: notifications })
  } catch (err) {
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

//mark one notification as read
export const markOneRead = async (req, res) => {
  try {
    const notif = await NotificationModel.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!notif)
      return res.status(404).json({ message: 'Notification not found' })

    notif.read = true
    await notif.save()

    res.status(200).json({ message: 'Marked as read', payload: notif })
  } catch (err) {
    res.status(500).json({ message: 'Server error', reason: err.message })
  }
}

//mark all notifications as read
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

//delete notification
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

//create notification
export const createNotification = async ({ userId, message, readLink }) => {
  try {
    await NotificationModel.create({ user: userId, message, readLink })
  } catch (err) {
    logger.error('Notification create error:', err.message)
  }
}



// NotificationsAPI routes: Express endpoints for this backend resource.
import express from 'express'
import {
  getNotifications,
  markOneRead,
  markAllRead,
  deleteNotification
} from '../controllers/notificationController.js'
import { verifyRolesToken } from '../middlewares/verifyRolesToekn.js'

export const notificationApp = express.Router()

const auth = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER', 'VIEWER')

//get all notifications for current user
notificationApp.get('/', auth, getNotifications)

//mark all as read - must be before /:id
notificationApp.put('/read-all', auth, markAllRead)

//mark one as read
notificationApp.put('/:id/read', auth, markOneRead)

//delete one
notificationApp.delete('/:id', auth, deleteNotification)



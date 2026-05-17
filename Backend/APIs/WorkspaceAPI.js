// WorkspaceAPI routes: Express endpoints for this backend resource.
import express from 'express'
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  acceptInvitation,
  removeMember
} from '../controllers/workspaceController.js'
import { verifyRolesToken } from '../middlewares/verifyRolesToekn.js'
import { UserModel } from '../models/usermodel.js'

export const workspaceApp = express.Router()

const auth = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER', 'VIEWER')
const write = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER')

//create + get all
workspaceApp
  .route('/workspaces')
  .post(auth, createWorkspace)
  .get(auth, getWorkspaces)

//single workspace
workspaceApp
  .route('/workspaces/:id')
  .get(auth, getWorkspaceById)
  .put(write, updateWorkspace)
  .delete(write, deleteWorkspace)

//add member
workspaceApp.post('/workspaces/:id/members', write, addMember)

//remove member
workspaceApp.delete('/workspaces/:id/members/:userId', write, removeMember)

//user search by email - used by invite flow
workspaceApp.get('/users/search', auth, async (req, res, next) => {
  try {
    const { email } = req.query
    if (!email)
      return res.status(400).json({ message: 'email query param required' })
    const user = await UserModel.findOne({
      email: email.toLowerCase().trim()
    }).select('_id name email profilePic')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json({ message: 'User found', payload: user })
  } catch (err) {
    next(err)
  }
})

//accept invitation (authenticated)
workspaceApp.post('/invitations/accept', auth, acceptInvitation)



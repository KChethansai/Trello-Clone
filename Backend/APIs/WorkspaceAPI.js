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
import { WorkspaceModel } from '../models/Workspace.js'
import { projectModel } from '../models/ProjectModel.js'
import { taskModel } from '../models/Taskmodel.js'
import { ActivityModel } from '../models/Activity.js'
import InvitationModel from '../models/Invitation.js'

export const workspaceApp = express.Router()

const auth = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER', 'VIEWER')
const write = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER')

const canAccessWorkspaceDoc = (workspace, userId) =>
  workspace &&
  (workspace.owner?.toString() === userId ||
    workspace.members?.some((member) => member.user?.toString() === userId))

const canManageWorkspaceDoc = (workspace, userId) => {
  const member = workspace?.members?.find((item) => item.user?.toString() === userId)
  return workspace?.owner?.toString() === userId || ['ADMIN', 'MANAGER'].includes(member?.role)
}

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

workspaceApp.get('/workspaces/:id/analytics', auth, async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id)
    if (!canAccessWorkspaceDoc(workspace, req.user.id)) {
      return res.status(403).json({ message: 'Workspace access denied' })
    }
    const projects = await projectModel
      .find({ workspace: req.params.id, status: true })
      .select('_id title name archivedAt members updatedAt')
      .lean()
    const projectIds = projects.map((project) => project._id)
    const [cards, activities, invitations] = await Promise.all([
      taskModel.find({ projectId: { $in: projectIds }, isActive: true }).lean(),
      ActivityModel.find({ project: { $in: projectIds } })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate('actor', 'name email profilePic')
        .lean(),
      InvitationModel.find({ workspace: req.params.id }).sort({ createdAt: -1 }).lean()
    ])
    const workload = cards.reduce((acc, card) => {
      const key = card.memberId?.toString() || 'unassigned'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    res.status(200).json({
      message: 'Workspace analytics fetched',
      payload: {
        totals: {
          projects: projects.length,
          archivedProjects: projects.filter((project) => project.archivedAt).length,
          cards: cards.length,
          invitations: invitations.length
        },
        productivity: {
          done: cards.filter((card) => card.status === 'DONE').length,
          overdue: cards.filter(
            (card) => card.dueDate && new Date(card.dueDate) < new Date() && card.status !== 'DONE'
          ).length
        },
        workload,
        recentActivity: activities,
        invitations
      }
    })
  } catch (err) {
    next(err)
  }
})

workspaceApp.get('/workspaces/:id/permissions', auth, async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id).lean()
    if (!canAccessWorkspaceDoc(workspace, req.user.id)) {
      return res.status(403).json({ message: 'Workspace access denied' })
    }
    res.status(200).json({
      message: 'Workspace permissions fetched',
      payload: workspace.permissions || {}
    })
  } catch (err) {
    next(err)
  }
})

workspaceApp.put('/workspaces/:id/permissions', write, async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id)
    if (!canManageWorkspaceDoc(workspace, req.user.id)) {
      return res.status(403).json({ message: 'Workspace access denied' })
    }
    workspace.permissions = { ...(workspace.permissions || {}), ...(req.body.permissions || {}) }
    await workspace.save()
    res.status(200).json({ message: 'Workspace permissions updated', payload: workspace.permissions })
  } catch (err) {
    next(err)
  }
})

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



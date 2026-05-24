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
import { ListModel } from '../models/ListModel.js'
import { taskModel } from '../models/Taskmodel.js'
import { ActivityModel } from '../models/Activity.js'
import InvitationModel from '../models/Invitation.js'

const ACTION_LABELS = {
  CREATED_TASK: 'created a card',
  UPDATED_TASK: 'updated a card',
  ASSIGNED_USER: 'assigned a member',
  COMMENT_ADDED: 'added a comment',
  MEMBER_ADDED: 'added a member',
  MEMBER_REMOVED: 'removed a member',
  INVITE_SENT: 'sent an invite',
  INVITE_ACCEPTED: 'accepted an invite',
  BOARD_ARCHIVED: 'archived a board',
  BOARD_IMPORTED: 'imported a board',
  BOARD_EXPORTED: 'exported a board'
}

const getWorkspaceProjects = async (workspaceId) =>
  projectModel
    .find({ workspace: workspaceId, status: true })
    .select('_id title name')
    .lean()

const formatActivityEntry = (activity, projectById) => {
  const actorName =
    activity.actor?.name || activity.actor?.email || 'Someone'
  const verb =
    ACTION_LABELS[activity.action] ||
    activity.action?.replace(/_/g, ' ').toLowerCase() ||
    'updated the board'
  const projectName =
    projectById[activity.project?.toString()] || 'a project'

  return {
    ...activity,
    projectName,
    message: `${actorName} ${verb} in ${projectName}`
  }
}

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

workspaceApp.get('/workspaces/:id/activity', auth, async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id)
    if (!canAccessWorkspaceDoc(workspace, req.user.id)) {
      return res.status(403).json({ message: 'Workspace access denied' })
    }

    const projects = await getWorkspaceProjects(req.params.id)
    const projectById = Object.fromEntries(
      projects.map((project) => [
        project._id.toString(),
        project.title || project.name || 'Project'
      ])
    )
    const projectIds = projects.map((project) => project._id)

    const activities = await ActivityModel.find({
      project: { $in: projectIds }
    })
      .populate('actor', 'name email')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    res.status(200).json({
      message: 'Workspace activity fetched',
      payload: activities.map((item) => formatActivityEntry(item, projectById))
    })
  } catch (err) {
    next(err)
  }
})

workspaceApp.get('/workspaces/:id/cards', auth, async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id)
    if (!canAccessWorkspaceDoc(workspace, req.user.id)) {
      return res.status(403).json({ message: 'Workspace access denied' })
    }

    const projects = await getWorkspaceProjects(req.params.id)
    const projectById = Object.fromEntries(
      projects.map((project) => [
        project._id.toString(),
        project.title || project.name || 'Project'
      ])
    )
    const projectIds = projects.map((project) => project._id)

    if (projectIds.length === 0) {
      return res.status(200).json({ message: 'Workspace cards fetched', payload: [] })
    }

    const [cards, lists] = await Promise.all([
      taskModel
        .find({ projectId: { $in: projectIds }, isActive: true })
        .populate('memberId', 'name email profilePic')
        .populate('memberIds', 'name email profilePic')
        .sort({ updatedAt: -1 })
        .lean(),
      ListModel.find({ projectId: { $in: projectIds } }).select('_id title projectId').lean()
    ])

    const listById = Object.fromEntries(
      lists.map((list) => [list._id.toString(), list.title || 'List'])
    )

    const payload = cards.map((card) => ({
      ...card,
      projectName: projectById[card.projectId?.toString()] || 'Project',
      listTitle: listById[card.listId?.toString()] || ''
    }))

    res.status(200).json({ message: 'Workspace cards fetched', payload })
  } catch (err) {
    next(err)
  }
})

workspaceApp.get('/workspaces/:id/analytics', auth, async (req, res, next) => {
  try {
    const workspace = await WorkspaceModel.findById(req.params.id)
    if (!canAccessWorkspaceDoc(workspace, req.user.id)) {
      return res.status(403).json({ message: 'Workspace access denied' })
    }
    const { q, status } = req.query
    const projectQuery = { workspace: req.params.id, status: true }

    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i')
      projectQuery.$or = [
        { title: searchRegex },
        { name: searchRegex }
      ]
    }

    if (status === 'ACTIVE') {
      projectQuery.archivedAt = null
    } else if (status === 'ARCHIVED') {
      projectQuery.archivedAt = { $ne: null }
    }

    const projects = await projectModel
      .find(projectQuery)
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
    const workloadCounts = {}
    for (const card of cards) {
      const assigneeIds = []
      if (Array.isArray(card.memberIds) && card.memberIds.length > 0) {
        assigneeIds.push(...card.memberIds.map((id) => id.toString()))
      } else if (card.memberId) {
        assigneeIds.push(card.memberId.toString())
      }

      if (assigneeIds.length === 0) {
        workloadCounts.unassigned = (workloadCounts.unassigned || 0) + 1
        continue
      }

      for (const userId of new Set(assigneeIds)) {
        workloadCounts[userId] = (workloadCounts[userId] || 0) + 1
      }
    }

    const userIds = Object.keys(workloadCounts).filter((key) => key !== 'unassigned')
    const users = userIds.length
      ? await UserModel.find({ _id: { $in: userIds } }).select('name email').lean()
      : []
    const nameById = Object.fromEntries(
      users.map((user) => [user._id.toString(), user.name || user.email || 'Unknown member'])
    )

    const workload = Object.entries(workloadCounts)
      .map(([key, count]) => ({
        userId: key === 'unassigned' ? null : key,
        name: key === 'unassigned' ? 'Unassigned' : nameById[key] || 'Unknown member',
        count
      }))
      .sort((a, b) => b.count - a.count)

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

// search users globally by name or email (partial matching)
workspaceApp.get('/users/search-all', auth, async (req, res, next) => {
  try {
    const { q } = req.query
    if (!q || !q.trim()) {
      return res.status(200).json({ message: 'Search completed', payload: [] })
    }
    const regex = new RegExp(q.trim(), 'i')
    const users = await UserModel.find({
      $or: [
        { name: regex },
        { email: regex }
      ]
    })
      .select('_id name email profilePic')
      .limit(10)
      .lean()
    res.status(200).json({ message: 'Users found', payload: users })
  } catch (err) {
    next(err)
  }
})

//accept invitation (authenticated)
workspaceApp.post('/invitations/accept', auth, acceptInvitation)



// ProjectsAPI routes: Express endpoints for this backend resource.
import exp from 'express'
import { verifyRolesToken } from '../middlewares/verifyRolesToekn.js'
import { projectModel } from '../models/ProjectModel.js'
import { ListModel } from '../models/ListModel.js'
import { taskModel } from '../models/Taskmodel.js'
import { WorkspaceModel } from '../models/Workspace.js'
import { ActivityModel } from '../models/Activity.js'
import { getIO } from '../socket.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/uploadToCloudinary.js'
import { env } from '../config/env.js'

export const projectsApp = exp.Router()

const auth = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER', 'VIEWER')
const write = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER', 'VIEWER')

const canAccessProject = (project, userId) =>
  project &&
  project.status !== false &&
  (project.isPublished ||
    project.creatorId?._id?.toString() === userId ||
    project.creatorId?.toString() === userId ||
    project.members?.some(
      (member) =>
        member?._id?.toString() === userId || member?.toString() === userId
    ))

const canAccessWorkspace = (workspace, userId) =>
  workspace &&
  (workspace.owner?.toString() === userId ||
    workspace.members?.some((member) => member.user?.toString() === userId))

const findAccessibleProject = async (projectId, userId) => {
  const project = await projectModel.findById(projectId)
  return canAccessProject(project, userId) ? project : null
}

const canEditProject = (project, userId) =>
  project &&
  (project.creatorId?._id?.toString() === userId ||
    project.creatorId?.toString() === userId ||
    (project.isPublished && project.isEditable))

const canManageProject = (project, userId) =>
  project &&
  (project.creatorId?._id?.toString() === userId ||
    project.creatorId?.toString() === userId)

const findEditableProject = async (projectId, userId) => {
  const project = await projectModel.findById(projectId)
  return canEditProject(project, userId) ? project : null
}

const findManageableProject = async (projectId, userId) => {
  const project = await projectModel.findById(projectId)
  return canManageProject(project, userId) ? project : null
}

const findAccessibleList = async (listId, userId) => {
  const list = await ListModel.findById(listId)
  if (!list) return null
  const project = await findAccessibleProject(list.projectId, userId)
  return project ? list : null
}

const findEditableList = async (listId, userId) => {
  const list = await ListModel.findById(listId)
  if (!list) return null
  const project = await findEditableProject(list.projectId, userId)
  return project ? list : null
}

const findAccessibleCard = async (cardId, userId) => {
  const card = await taskModel.findById(cardId)
  if (!card) return null
  const project = await findAccessibleProject(card.projectId, userId)
  return project ? card : null
}

const findEditableCard = async (cardId, userId) => {
  const card = await taskModel.findById(cardId)
  if (!card) return null
  const project = await findEditableProject(card.projectId, userId)
  return project ? card : null
}

const uploadImageFile = async (file, folder) => {
  if (!file) return null
  if (
    !env.cloudinaryCloudName ||
    !env.cloudinaryApiKey ||
    !env.cloudinaryApiSecret
  ) {
    const err = new Error('Cloudinary image uploads are not configured')
    err.status = 503
    throw err
  }
  const uploaded = await uploadToCloudinary(file.buffer, folder)
  return {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    fileName: file.originalname,
    fileType: file.mimetype,
    size: file.size
  }
}

const normalizeCardCreatePayload = (body = {}) => {
  const title = body.title?.trim()
  if (!title) {
    const err = new Error('Card title required')
    err.status = 400
    throw err
  }

  return {
    title: title.slice(0, 240),
    description: body.description || '',
    richDescription: body.richDescription || '',
    dueDate: body.dueDate || null,
    labels: Array.isArray(body.labels) ? body.labels : [],
    priority: body.priority || 'MEDIUM',
    status: body.status || 'TO-DO',
    estimatedMinutes: Math.max(0, Number(body.estimatedMinutes) || 0),
    recurring: body.recurring || { enabled: false, interval: 'NONE' },
    subtasks: Array.isArray(body.subtasks) ? body.subtasks : [],
    checklists: Array.isArray(body.checklists) ? body.checklists : [],
    watchers: Array.isArray(body.watchers) ? body.watchers : [],
    comments: Array.isArray(body.comments) ? body.comments : [],
    reactions: Array.isArray(body.reactions) ? body.reactions : []
  }
}

const buildProjectAnalytics = async (projectId) => {
  const [lists, cards, activityCount] = await Promise.all([
    ListModel.find({ projectId }).sort('order').lean(),
    taskModel.find({ projectId, isActive: true }).lean(),
    ActivityModel.countDocuments({ project: projectId })
  ])
  return {
    totals: { lists: lists.length, cards: cards.length, activity: activityCount },
    byStatus: cards.reduce((acc, card) => {
      const key = card.status || 'UNSET'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {}),
    byPriority: cards.reduce((acc, card) => {
      const key = card.priority || 'MEDIUM'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {}),
    overdue: cards.filter(
      (card) => card.dueDate && new Date(card.dueDate) < new Date() && card.status !== 'DONE'
    ).length,
    workload: cards.reduce((acc, card) => {
      const owner = card.memberId?.toString() || 'unassigned'
      acc[owner] = (acc[owner] || 0) + 1
      return acc
    }, {})
  }
}

const buildProjectExport = async (project) => {
  const lists = await ListModel.find({ projectId: project._id }).sort('order').lean()
  const cards = await taskModel.find({ projectId: project._id, isActive: true }).sort({ listId: 1, order: 1 }).lean()
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    board: { ...project.toObject(), title: project.title || project.name },
    lists,
    cards
  }
}

// Projects

// GET /projects-api/projects - all projects for the logged-in user
projectsApp.get('/projects', auth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { workspaceId } = req.query
    const query = {
      $or: [{ creatorId: userId }, { members: userId }],
      status: true
    }

    if (workspaceId) {
      const workspace = await WorkspaceModel.findById(workspaceId)
      if (!canAccessWorkspace(workspace, userId)) {
        return res.status(403).json({ message: 'Workspace access denied' })
      }
      query.workspace = workspaceId
    }

    const projects = await projectModel
      .find(query)
      .populate('workspace', 'name')
      .populate('creatorId', 'name email')
      .sort({ updatedAt: -1 })

    const payload = projects.map((b) => ({
      ...b.toObject(),
      title: b.title || b.name
    }))
    res.status(200).json({ message: 'Projects fetched', payload })
  } catch (err) {
    console.error('Error in GET /projects:', err)
    next(err)
  }
})

// GET /projects-api/projects/recent - 5 most recently updated
projectsApp.get('/projects/recent', auth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const projects = await projectModel
      .find({ $or: [{ creatorId: userId }, { members: userId }], status: true })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('creatorId', 'name email')

    const payload = projects.map((b) => ({
      ...b.toObject(),
      title: b.title || b.name
    }))
    res.status(200).json({ message: 'Recent projects fetched', payload })
  } catch (err) {
    next(err)
  }
})

// GET /projects-api/projects/:id - single project
projectsApp.get('/projects/:id', auth, async (req, res, next) => {
  try {
    const project = await projectModel
      .findById(req.params.id)
      .populate('workspace', 'name')
      .populate('creatorId', 'name email')
      .populate('members', 'name email')

    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (!canAccessProject(project, req.user.id)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.status(200).json({
      message: 'Project fetched',
      payload: { ...project.toObject(), title: project.title || project.name }
    })
  } catch (err) {
    next(err)
  }
})

projectsApp.get('/projects/:id/analytics', auth, async (req, res, next) => {
  try {
    const project = await findAccessibleProject(req.params.id, req.user.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.status(200).json({
      message: 'Project analytics fetched',
      payload: await buildProjectAnalytics(project._id)
    })
  } catch (err) {
    next(err)
  }
})

projectsApp.get('/projects/:id/export', auth, async (req, res, next) => {
  try {
    const project = await findAccessibleProject(req.params.id, req.user.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    project.auditLogs.push({
      actor: req.user.id,
      action: 'PROJECT_EXPORTED',
      meta: { requestId: req.requestId }
    })
    await project.save()
    res.status(200).json({
      message: 'Project export generated',
      payload: await buildProjectExport(project)
    })
  } catch (err) {
    next(err)
  }
})

projectsApp.put('/projects/:id/archive', auth, async (req, res, next) => {
  try {
    const project = await findManageableProject(req.params.id, req.user.id)
    if (!project) return res.status(403).json({ message: 'Only the owner can archive this project' })
    project.archivedAt = req.body.archived === false ? null : new Date()
    project.auditLogs.push({
      actor: req.user.id,
      action: project.archivedAt ? 'PROJECT_ARCHIVED' : 'PROJECT_RESTORED',
      meta: { requestId: req.requestId }
    })
    await project.save()
    getIO().to(`project:${project._id}`).emit('project-updated', {
      ...project.toObject(),
      title: project.title || project.name
    })
    res.status(200).json({ message: 'Project archive state updated', payload: project })
  } catch (err) {
    next(err)
  }
})

// POST /projects-api/projects - create project
projectsApp.post('/projects', auth, upload.single('background'), async (req, res, next) => {
  try {
    const { title, color, img, workspaceId, isEditable, isPublished } = req.body
    if (!title?.trim())
      return res.status(400).json({ message: 'Project title is required' })

    let workspace = null
    if (workspaceId) {
      workspace = await WorkspaceModel.findById(workspaceId)
      if (!canAccessWorkspace(workspace, req.user.id)) {
        return res.status(403).json({ message: 'Workspace access denied' })
      }
    } else if (!['MEMBER', 'ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only members and above can create personal projects' })
    }

    const workspaceMembers = workspace?.members?.map((member) => member.user?.toString()).filter(Boolean) || []
    const projectMembers = [...new Set([req.user.id, ...workspaceMembers])]

    const uploadedBackground = await uploadImageFile(req.file, 'project_backgrounds')

    const project = new projectModel({
      name: title.trim(),
      title: title.trim(),
      color: color || 'from-blue-500 to-blue-700',
      img: uploadedBackground?.url || img || null,
      imgPublicId: uploadedBackground?.publicId || null,
      workspace: workspaceId || null,
      creatorId: req.user.id,
      members: projectMembers,
      isEditable: isEditable === 'true' || isEditable === true,
      isPublished: isPublished === 'true' || isPublished === true
    })
    await project.save()

    res.status(201).json({ message: 'Project created', payload: project })
  } catch (err) {
    next(err)
  }
})

// PUT /projects-api/projects/:id - update project
projectsApp.put('/projects/:id', auth, upload.single('background'), async (req, res, next) => {
  try {
    const { title, description, color, img, isEditable, isPublished, publishDetails } = req.body
    const project = await findManageableProject(req.params.id, req.user.id)
    if (!project) return res.status(403).json({ message: 'Only the owner can manage project settings' })

    const uploadedBackground = await uploadImageFile(req.file, 'project_backgrounds')

    const updated = await projectModel.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { name: title, title }),
        ...(description !== undefined && { description }),
        ...(color && { color }),
        ...(img !== undefined && { img }),
        ...(isEditable !== undefined && { isEditable: isEditable === 'true' || isEditable === true }),
        ...(isPublished !== undefined && { isPublished: isPublished === 'true' || isPublished === true }),
        ...(publishDetails && { publishDetails }),
        ...(uploadedBackground && {
          img: uploadedBackground.url,
          imgPublicId: uploadedBackground.publicId
        })
      },
      { new: true }
    )
    .populate('workspace', 'name')
    .populate('creatorId', 'name email')

    if (!updated) return res.status(404).json({ message: 'Project not found' })

    getIO().to(`project:${req.params.id}`).emit('project-updated', {
      ...updated.toObject(),
      title: updated.title || updated.name
    })

    res.status(200).json({ message: 'Project updated', payload: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /projects-api/projects/:id - soft delete
projectsApp.delete('/projects/:id', auth, async (req, res, next) => {
  try {
    const project = await findManageableProject(req.params.id, req.user.id)
    if (!project) return res.status(403).json({ message: 'Only the owner can delete this project' })
    project.status = false
    await project.save()

    getIO().to(`project:${req.params.id}`).emit('project-deleted', { projectId: req.params.id })

    res.status(200).json({ message: 'Project deleted' })
  } catch (err) {
    next(err)
  }
})

// Lists

// GET /projects-api/projects/:id/lists
projectsApp.get('/projects/:id/lists', auth, async (req, res, next) => {
  try {
    const project = await findAccessibleProject(req.params.id, req.user.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const lists = await ListModel.find({ projectId: req.params.id }).sort('order')
    res.status(200).json({ message: 'Lists fetched', payload: lists })
  } catch (err) {
    next(err)
  }
})

// POST /projects-api/projects/:id/lists
projectsApp.post('/projects/:id/lists', write, async (req, res, next) => {
  try {
    const { title } = req.body
    if (!title?.trim()) return res.status(400).json({ message: 'Title required' })
    const project = await findEditableProject(req.params.id, req.user.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const count = await ListModel.countDocuments({ projectId: req.params.id })
    const list = new ListModel({
      title: title.trim(),
      projectId: req.params.id,
      order: count
    })
    await list.save()

    getIO().to(`project:${req.params.id}`).emit('list-created', list)

    res.status(201).json({ message: 'List created', payload: list })
  } catch (err) {
    next(err)
  }
})

// PUT /projects-api/lists/:id
projectsApp.put('/lists/:id', write, async (req, res, next) => {
  try {
    const list = await findEditableList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    const updated = await ListModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ message: 'List not found' })

    getIO().to(`project:${updated.projectId}`).emit('list-updated', updated)

    res.status(200).json({ message: 'List updated', payload: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /projects-api/lists/:id
projectsApp.delete('/lists/:id', write, async (req, res, next) => {
  try {
    const list = await findEditableList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    await taskModel.deleteMany({ listId: req.params.id })
    await ListModel.findByIdAndDelete(req.params.id)

    getIO().to(`project:${list.projectId}`).emit('list-deleted', { listId: req.params.id })

    res.status(200).json({ message: 'List deleted' })
  } catch (err) {
    next(err)
  }
})

// PUT /projects-api/projects/:id/lists/reorder
projectsApp.put('/projects/:id/lists/reorder', write, async (req, res, next) => {
  try {
    const project = await findEditableProject(req.params.id, req.user.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const { orderedIds } = req.body
    if (!Array.isArray(orderedIds)) return res.status(400).json({ message: 'orderedIds array required' })

    const matchingLists = await ListModel.countDocuments({ _id: { $in: orderedIds }, projectId: req.params.id })
    if (matchingLists !== orderedIds.length) {
      return res.status(400).json({ message: 'Invalid list order payload' })
    }

    await Promise.all(orderedIds.map((id, index) => ListModel.findByIdAndUpdate(id, { order: index })))

    getIO().to(`project:${req.params.id}`).emit('lists-reordered', { orderedIds })

    res.status(200).json({ message: 'Lists reordered' })
  } catch (err) {
    next(err)
  }
})

// Cards

// GET /projects-api/lists/:id/cards
projectsApp.get('/lists/:id/cards', auth, async (req, res, next) => {
  try {
    const list = await findAccessibleList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    const cards = await taskModel.find({ listId: req.params.id, isActive: true })
      .populate('memberId', 'name email profilePic')
      .sort({ order: 1, createdAt: 1 })

    res.status(200).json({ message: 'Cards fetched', payload: cards })
  } catch (err) {
    next(err)
  }
})

// POST /projects-api/lists/:id/cards
projectsApp.post('/lists/:id/cards', write, async (req, res, next) => {
  try {
    const list = await findEditableList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    const cardPayload = normalizeCardCreatePayload(req.body)

    const count = await taskModel.countDocuments({ listId: req.params.id, isActive: true })
    const card = new taskModel({
      ...cardPayload,
      listId: req.params.id,
      projectId: list.projectId,
      creatorId: req.user.id,
      order: count
    })
    await card.save()

    getIO().to(`project:${list.projectId}`).emit('card-created', { ...card.toObject(), listId: req.params.id })

    res.status(201).json({ message: 'Card created', payload: card })
  } catch (err) {
    next(err)
  }
})

// PUT /projects-api/cards/:id - update or move card
projectsApp.put('/cards/:id', write, async (req, res, next) => {
  try {
    const card = await findEditableCard(req.params.id, req.user.id)
    if (!card) return res.status(404).json({ message: 'Card not found' })

    if (req.body.listId) {
      const targetList = await findEditableList(req.body.listId, req.user.id)
      if (!targetList || targetList.projectId.toString() !== card.projectId.toString()) {
        return res.status(400).json({ message: 'Invalid target list' })
      }
    }

    const updated = await taskModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Card not found' })

    getIO().to(`project:${updated.projectId}`).emit('card-updated', updated)

    res.status(200).json({ message: 'Card updated', payload: updated })
  } catch (err) {
    next(err)
  }
})

// POST /projects-api/cards/:id/attachments
projectsApp.post('/cards/:id/attachments', write, upload.single('attachment'), async (req, res, next) => {
  try {
    const card = await findEditableCard(req.params.id, req.user.id)
    if (!card) return res.status(404).json({ message: 'Card not found' })
    if (!req.file) return res.status(400).json({ message: 'Image attachment is required' })

    const image = await uploadImageFile(req.file, 'card_attachments')
    const attachment = {
      name: image.fileName,
      url: image.url,
      publicId: image.publicId,
      fileType: image.fileType,
      size: image.size
    }

    card.attachment = [...(card.attachment || []), attachment]
    await card.save()

    getIO().to(`project:${card.projectId}`).emit('card-updated', card)

    res.status(201).json({ message: 'Attachment uploaded', payload: card })
  } catch (err) {
    next(err)
  }
})

// DELETE /projects-api/cards/:id
projectsApp.delete('/cards/:id', write, async (req, res, next) => {
  try {
    const accessibleCard = await findEditableCard(req.params.id, req.user.id)
    if (!accessibleCard) return res.status(404).json({ message: 'Card not found' })

    const card = await taskModel.findByIdAndDelete(req.params.id)
    if (!card) return res.status(404).json({ message: 'Card not found' })

    getIO().to(`project:${card.projectId}`).emit('card-deleted', {
      cardId: req.params.id,
      listId: card.listId?.toString()
    })

    res.status(200).json({ message: 'Card deleted' })
  } catch (err) {
    next(err)
  }
})

// PUT /projects-api/lists/:id/cards/reorder
projectsApp.put('/lists/:id/cards/reorder', write, async (req, res, next) => {
  try {
    const list = await findEditableList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    const { orderedIds } = req.body
    if (!Array.isArray(orderedIds)) return res.status(400).json({ message: 'orderedIds array required' })

    const matchingCards = await taskModel.countDocuments({ _id: { $in: orderedIds }, listId: req.params.id, isActive: true })
    if (matchingCards !== orderedIds.length) {
      return res.status(400).json({ message: 'Invalid card order payload' })
    }

    await Promise.all(orderedIds.map((id, index) => taskModel.findByIdAndUpdate(id, { order: index })))

    getIO().to(`project:${list.projectId}`).emit('cards-reordered', { listId: req.params.id, orderedIds })

    res.status(200).json({ message: 'Cards reordered' })
  } catch (err) {
    next(err)
  }
})

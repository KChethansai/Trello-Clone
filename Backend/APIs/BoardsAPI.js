// BoardsAPI routes: Express endpoints for this backend resource.
import exp from 'express'
import { Types } from 'mongoose'
import { verifyRolesToken } from '../middlewares/verifyRolesToken.js'
import { projectModel } from '../models/ProjectModel.js'
import { ListModel } from '../models/ListModel.js'
import { taskModel } from '../models/Taskmodel.js'
import { WorkspaceModel } from '../models/Workspace.js'
import { ActivityModel } from '../models/Activity.js'
import { getIO } from '../socket.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/uploadToCloudinary.js'
import { env } from '../config/env.js'

export const boardsApp = exp.Router()

const auth = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER', 'VIEWER')
const write = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER')

const canAccessBoard = (board, userId) =>
  board &&
  board.status !== false &&
  (board.creatorId?._id?.toString() === userId ||
    board.creatorId?.toString() === userId ||
    board.members?.some(
      (member) =>
        member?._id?.toString() === userId || member?.toString() === userId
    ))

const canAccessWorkspace = (workspace, userId) =>
  workspace &&
  (workspace.owner?.toString() === userId ||
    workspace.members?.some((member) => member.user?.toString() === userId))

const PRIORITIES = new Set(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
const RECURRENCE = new Set(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'])
const CARD_MUTABLE_FIELDS = new Set([
  'title',
  'description',
  'richDescription',
  'dueDate',
  'labels',
  'priority',
  'estimatedMinutes',
  'recurring',
  'subtasks',
  'checklists',
  'coverImage',
  'watchers',
  'comments',
  'reactions',
  'status',
  'listId'
])

const asObjectIdArray = (items = []) =>
  Array.isArray(items)
    ? items.filter((id) => Types.ObjectId.isValid(id)).map((id) => id)
    : []

const cleanLabels = (labels = []) =>
  Array.isArray(labels)
    ? labels
        .filter((label) => label?.text)
        .map((label) => ({
          text: String(label.text).trim().slice(0, 40),
          color: label.color || '#94a3b8'
        }))
        .slice(0, 12)
    : []

const cleanChecklistItems = (items = []) =>
  Array.isArray(items)
    ? items
        .filter((item) => item?.title)
        .map((item) => ({
          title: String(item.title).trim().slice(0, 160),
          completed: Boolean(item.completed)
        }))
    : []

const cleanCardPayload = (body, { partial = false } = {}) => {
  const payload = {}

  Object.entries(body || {}).forEach(([key, value]) => {
    if (CARD_MUTABLE_FIELDS.has(key)) payload[key] = value
  })

  if (!partial || payload.title !== undefined) {
    const title = payload.title?.trim()
    if (!title) {
      const err = new Error('Card title required')
      err.status = 400
      throw err
    }
    payload.title = title.slice(0, 240)
  }

  if (payload.description !== undefined) {
    payload.description = String(payload.description || '').slice(0, 8000)
  }
  if (payload.richDescription !== undefined) {
    payload.richDescription = String(payload.richDescription || '').slice(0, 20000)
  }
  if (payload.dueDate !== undefined) {
    payload.dueDate = payload.dueDate ? new Date(payload.dueDate) : null
    if (payload.dueDate && Number.isNaN(payload.dueDate.getTime())) {
      const err = new Error('Invalid due date')
      err.status = 400
      throw err
    }
  }
  if (payload.labels !== undefined) payload.labels = cleanLabels(payload.labels)
  if (payload.priority !== undefined) {
    payload.priority = String(payload.priority || 'MEDIUM').toUpperCase()
    if (!PRIORITIES.has(payload.priority)) payload.priority = 'MEDIUM'
  }
  if (payload.estimatedMinutes !== undefined) {
    payload.estimatedMinutes = Math.max(0, Number(payload.estimatedMinutes) || 0)
  }
  if (payload.recurring !== undefined) {
    payload.recurring = {
      enabled: Boolean(payload.recurring?.enabled),
      interval: RECURRENCE.has(payload.recurring?.interval)
        ? payload.recurring.interval
        : 'NONE',
      nextRunAt: payload.recurring?.nextRunAt
        ? new Date(payload.recurring.nextRunAt)
        : null
    }
  }
  if (payload.subtasks !== undefined) {
    payload.subtasks = Array.isArray(payload.subtasks)
      ? payload.subtasks
          .filter((item) => item?.title)
          .map((item) => ({
            title: String(item.title).trim().slice(0, 160),
            completed: Boolean(item.completed),
            assigneeId: Types.ObjectId.isValid(item.assigneeId)
              ? item.assigneeId
              : null
          }))
      : []
  }
  if (payload.checklists !== undefined) {
    payload.checklists = Array.isArray(payload.checklists)
      ? payload.checklists.map((checklist) => ({
          title: String(checklist?.title || 'Checklist').trim().slice(0, 80),
          items: cleanChecklistItems(checklist?.items)
        }))
      : []
  }
  if (payload.coverImage !== undefined) {
    payload.coverImage = {
      url: payload.coverImage?.url || '',
      publicId: payload.coverImage?.publicId || ''
    }
  }
  if (payload.watchers !== undefined) payload.watchers = asObjectIdArray(payload.watchers)
  if (payload.comments !== undefined) {
    payload.comments = Array.isArray(payload.comments)
      ? payload.comments
          .filter((comment) => comment?.body)
          .map((comment) => ({
            ...comment,
            body: String(comment.body).trim().slice(0, 4000),
            mentions: asObjectIdArray(comment.mentions),
            createdAt: comment.createdAt || new Date()
          }))
      : []
  }
  if (payload.reactions !== undefined) {
    payload.reactions = Array.isArray(payload.reactions)
      ? payload.reactions
          .filter((reaction) => reaction?.emoji && Types.ObjectId.isValid(reaction.userId))
          .map((reaction) => ({ emoji: reaction.emoji, userId: reaction.userId }))
      : []
  }

  return payload
}

const emitBoardActivity = (projectId, activity) => {
  getIO().to(`board:${projectId}`).emit('activity-created', {
    ...activity,
    createdAt: new Date().toISOString()
  })
}

const buildBoardExport = async (board) => {
  const lists = await ListModel.find({ projectId: board._id }).sort('order').lean()
  const cards = await taskModel
    .find({ projectId: board._id, isActive: true })
    .sort({ listId: 1, order: 1 })
    .lean()
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    board: { ...board.toObject(), title: board.title || board.name },
    lists,
    cards
  }
}

const buildBoardAnalytics = async (boardId) => {
  const [lists, cards, activityCount] = await Promise.all([
    ListModel.find({ projectId: boardId }).sort('order').lean(),
    taskModel.find({ projectId: boardId, isActive: true }).lean(),
    ActivityModel.countDocuments({ project: boardId })
  ])
  const byStatus = cards.reduce((acc, card) => {
    const key = card.status || 'UNSET'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const byPriority = cards.reduce((acc, card) => {
    const key = card.priority || 'MEDIUM'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const overdue = cards.filter(
    (card) => card.dueDate && new Date(card.dueDate) < new Date() && card.status !== 'DONE'
  ).length
  return {
    totals: { lists: lists.length, cards: cards.length, activity: activityCount },
    byStatus,
    byPriority,
    overdue,
    workload: cards.reduce((acc, card) => {
      const owner = card.memberId?.toString() || 'unassigned'
      acc[owner] = (acc[owner] || 0) + 1
      return acc
    }, {})
  }
}

const findAccessibleBoard = async (boardId, userId) => {
  const board = await projectModel.findById(boardId)
  return canAccessBoard(board, userId) ? board : null
}

const findAccessibleList = async (listId, userId) => {
  const list = await ListModel.findById(listId)
  if (!list) return null
  const board = await findAccessibleBoard(list.projectId, userId)
  return board ? list : null
}

const findAccessibleCard = async (cardId, userId) => {
  const card = await taskModel.findById(cardId)
  if (!card) return null
  const board = await findAccessibleBoard(card.projectId, userId)
  return board ? card : null
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

// Boards

// GET /boards-api/boards - all boards for the logged-in user
boardsApp.get('/boards', auth, async (req, res, next) => {
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

    const boards = await projectModel
      .find(query)
      .populate('workspace', 'name')
      .populate('creatorId', 'name email')
      .sort({ updatedAt: -1 })

    const payload = boards.map((b) => ({
      ...b.toObject(),
      title: b.title || b.name
    }))
    res.status(200).json({ message: 'Boards fetched', payload })
  } catch (err) {
    next(err)
  }
})

// GET /boards-api/boards/recent - 5 most recently updated
boardsApp.get('/boards/recent', auth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const boards = await projectModel
      .find({ $or: [{ creatorId: userId }, { members: userId }], status: true })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('creatorId', 'name email')

    const payload = boards.map((b) => ({
      ...b.toObject(),
      title: b.title || b.name
    }))
    res.status(200).json({ message: 'Recent boards fetched', payload })
  } catch (err) {
    next(err)
  }
})

// GET /boards-api/boards/:id - single board
boardsApp.get('/boards/:id', auth, async (req, res, next) => {
  try {
    const board = await projectModel
      .findById(req.params.id)
      .populate('workspace', 'name')
      .populate('creatorId', 'name email')
      .populate('members', 'name email')

    if (!board) return res.status(404).json({ message: 'Board not found' })
    if (!canAccessBoard(board, req.user.id)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.status(200).json({
      message: 'Board fetched',
      payload: { ...board.toObject(), title: board.title || board.name }
    })
  } catch (err) {
    next(err)
  }
})

boardsApp.get('/boards/:id/analytics', auth, async (req, res, next) => {
  try {
    const board = await findAccessibleBoard(req.params.id, req.user.id)
    if (!board) return res.status(404).json({ message: 'Board not found' })
    res.status(200).json({
      message: 'Board analytics fetched',
      payload: await buildBoardAnalytics(board._id)
    })
  } catch (err) {
    next(err)
  }
})

boardsApp.get('/boards/:id/export', auth, async (req, res, next) => {
  try {
    const board = await findAccessibleBoard(req.params.id, req.user.id)
    if (!board) return res.status(404).json({ message: 'Board not found' })
    board.auditLogs.push({
      actor: req.user.id,
      action: 'BOARD_EXPORTED',
      meta: { requestId: req.requestId }
    })
    await board.save()
    res.status(200).json({
      message: 'Board export generated',
      payload: await buildBoardExport(board)
    })
  } catch (err) {
    next(err)
  }
})

boardsApp.put('/boards/:id/archive', write, async (req, res, next) => {
  try {
    const board = await findAccessibleBoard(req.params.id, req.user.id)
    if (!board) return res.status(404).json({ message: 'Board not found' })
    board.archivedAt = req.body.archived === false ? null : new Date()
    board.auditLogs.push({
      actor: req.user.id,
      action: board.archivedAt ? 'BOARD_ARCHIVED' : 'BOARD_RESTORED',
      meta: { requestId: req.requestId }
    })
    await board.save()
    getIO().to(`board:${board._id}`).emit('board-updated', {
      ...board.toObject(),
      title: board.title || board.name
    })
    res.status(200).json({ message: 'Board archive state updated', payload: board })
  } catch (err) {
    next(err)
  }
})

boardsApp.post('/boards/import', write, async (req, res, next) => {
  try {
    const source = req.body?.board ? req.body : req.body?.payload
    if (!source?.board?.title && !source?.board?.name) {
      return res.status(400).json({ message: 'Invalid board import payload' })
    }
    const board = new projectModel({
      name: `${source.board.title || source.board.name} (Imported)`,
      title: `${source.board.title || source.board.name} (Imported)`,
      color: source.board.color,
      img: source.board.img,
      workspace: source.board.workspace || null,
      creatorId: req.user.id,
      members: [req.user.id],
      auditLogs: [{ actor: req.user.id, action: 'BOARD_IMPORTED' }]
    })
    await board.save()

    const listIdMap = new Map()
    for (const item of source.lists || []) {
      const list = await ListModel.create({
        title: item.title,
        projectId: board._id,
        order: item.order || 0
      })
      listIdMap.set(item._id?.toString(), list._id)
    }

    await taskModel.insertMany(
      (source.cards || []).map((card) => ({
        ...card,
        _id: undefined,
        projectId: board._id,
        listId: listIdMap.get(card.listId?.toString()) || null,
        creatorId: req.user.id
      }))
    )

    res.status(201).json({ message: 'Board imported', payload: board })
  } catch (err) {
    next(err)
  }
})

// POST /boards-api/boards - create board
boardsApp.post(
  '/boards',
  write,
  upload.single('background'),
  async (req, res, next) => {
    try {
      const { title, color, img, workspaceId } = req.body
      if (!title?.trim())
        return res.status(400).json({ message: 'Board title is required' })
      if (workspaceId) {
        const workspace = await WorkspaceModel.findById(workspaceId)
        if (!canAccessWorkspace(workspace, req.user.id)) {
          return res.status(403).json({ message: 'Workspace access denied' })
        }
      }
      const workspace = workspaceId
        ? await WorkspaceModel.findById(workspaceId)
        : null
      const workspaceMembers = workspace
        ? [
            workspace.owner,
            ...(workspace.members || []).map((member) => member.user)
          ].filter(Boolean)
        : []
      const boardMembers = [...new Set([req.user.id, ...workspaceMembers])]
      const uploadedBackground = await uploadImageFile(
        req.file,
        'board_backgrounds'
      )

      const board = new projectModel({
        name: title.trim(),
        title: title.trim(),
        color: color || 'from-blue-500 to-blue-700',
        img: uploadedBackground?.url || img || null,
        imgPublicId: uploadedBackground?.publicId || null,
        workspace: workspaceId || null,
        creatorId: req.user.id,
        members: boardMembers
      })
      await board.save()

      res.status(201).json({ message: 'Board created', payload: board })
    } catch (err) {
      next(err)
    }
  }
)

// PUT /boards-api/boards/:id - update board
boardsApp.put(
  '/boards/:id',
  write,
  upload.single('background'),
  async (req, res, next) => {
    try {
      const { title, color, img } = req.body
      const board = await findAccessibleBoard(req.params.id, req.user.id)
      if (!board) return res.status(404).json({ message: 'Board not found' })
      const uploadedBackground = await uploadImageFile(
        req.file,
        'board_backgrounds'
      )

      const updated = await projectModel
        .findByIdAndUpdate(
          req.params.id,
          {
            ...(title && { name: title, title }),
            ...(color && { color }),
            ...(img !== undefined && { img }),
            ...(uploadedBackground && {
              img: uploadedBackground.url,
              imgPublicId: uploadedBackground.publicId
            })
          },
          { new: true }
        )
        .populate('workspace', 'name')
        .populate('creatorId', 'name email')

      if (!updated) return res.status(404).json({ message: 'Board not found' })

      getIO()
        .to(`board:${req.params.id}`)
        .emit('board-updated', {
          ...updated.toObject(),
          title: updated.title || updated.name
        })

      res.status(200).json({ message: 'Board updated', payload: updated })
    } catch (err) {
      next(err)
    }
  }
)

// DELETE /boards-api/boards/:id - soft delete
boardsApp.delete('/boards/:id', write, async (req, res, next) => {
  try {
    const board = await findAccessibleBoard(req.params.id, req.user.id)
    if (!board) return res.status(404).json({ message: 'Board not found' })
    board.status = false
    await board.save()

    getIO()
      .to(`board:${req.params.id}`)
      .emit('board-deleted', { boardId: req.params.id })

    res.status(200).json({ message: 'Board deleted' })
  } catch (err) {
    next(err)
  }
})

// Lists

// GET /boards-api/boards/:id/lists
boardsApp.get('/boards/:id/lists', auth, async (req, res, next) => {
  try {
    const board = await findAccessibleBoard(req.params.id, req.user.id)
    if (!board) return res.status(404).json({ message: 'Board not found' })

    const lists = await ListModel.find({ projectId: req.params.id }).sort(
      'order'
    )
    res.status(200).json({ message: 'Lists fetched', payload: lists })
  } catch (err) {
    next(err)
  }
})

// POST /boards-api/boards/:id/lists
boardsApp.post('/boards/:id/lists', write, async (req, res, next) => {
  try {
    const { title } = req.body
    if (!title?.trim())
      return res.status(400).json({ message: 'Title required' })
    const board = await findAccessibleBoard(req.params.id, req.user.id)
    if (!board) return res.status(404).json({ message: 'Board not found' })

    const count = await ListModel.countDocuments({ projectId: req.params.id })
    const list = new ListModel({
      title: title.trim(),
      projectId: req.params.id,
      order: count
    })
    await list.save()

    getIO().to(`board:${req.params.id}`).emit('list-created', list)

    res.status(201).json({ message: 'List created', payload: list })
  } catch (err) {
    next(err)
  }
})

// PUT /boards-api/lists/:id
boardsApp.put('/lists/:id', write, async (req, res, next) => {
  try {
    const list = await findAccessibleList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    const updated = await ListModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    if (!updated) return res.status(404).json({ message: 'List not found' })

    getIO().to(`board:${updated.projectId}`).emit('list-updated', updated)

    res.status(200).json({ message: 'List updated', payload: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /boards-api/lists/:id
boardsApp.delete('/lists/:id', write, async (req, res, next) => {
  try {
    const list = await findAccessibleList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    await taskModel.deleteMany({ listId: req.params.id })
    await ListModel.findByIdAndDelete(req.params.id)

    getIO()
      .to(`board:${list.projectId}`)
      .emit('list-deleted', { listId: req.params.id })

    res.status(200).json({ message: 'List deleted' })
  } catch (err) {
    next(err)
  }
})

// PUT /boards-api/boards/:id/lists/reorder
boardsApp.put('/boards/:id/lists/reorder', write, async (req, res, next) => {
  try {
    const board = await findAccessibleBoard(req.params.id, req.user.id)
    if (!board) return res.status(404).json({ message: 'Board not found' })

    const { orderedIds } = req.body
    if (!Array.isArray(orderedIds))
      return res.status(400).json({ message: 'orderedIds array required' })
    const matchingLists = await ListModel.countDocuments({
      _id: { $in: orderedIds },
      projectId: req.params.id
    })
    if (matchingLists !== orderedIds.length) {
      return res.status(400).json({ message: 'Invalid list order payload' })
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        ListModel.findByIdAndUpdate(id, { order: index })
      )
    )

    getIO().to(`board:${req.params.id}`).emit('lists-reordered', { orderedIds })

    res.status(200).json({ message: 'Lists reordered' })
  } catch (err) {
    next(err)
  }
})

// Cards

// GET /boards-api/lists/:id/cards
boardsApp.get('/lists/:id/cards', auth, async (req, res, next) => {
  try {
    const list = await findAccessibleList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    const cards = await taskModel
      .find({ listId: req.params.id, isActive: true })
      .populate('memberId', 'name email profilePic')
      .sort({ order: 1, createdAt: 1 })

    res.status(200).json({ message: 'Cards fetched', payload: cards })
  } catch (err) {
    next(err)
  }
})

// POST /boards-api/lists/:id/cards
boardsApp.post('/lists/:id/cards', write, async (req, res, next) => {
  try {
    const list = await findAccessibleList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    const cardPayload = cleanCardPayload(req.body)

    const count = await taskModel.countDocuments({
      listId: req.params.id,
      isActive: true
    })
    const card = new taskModel({
      ...cardPayload,
      listId: req.params.id,
      projectId: list.projectId,
      creatorId: req.user.id,
      order: count
    })
    await card.save()

    getIO()
      .to(`board:${list.projectId}`)
      .emit('card-created', { ...card.toObject(), listId: req.params.id })
    emitBoardActivity(list.projectId, {
      type: 'card-created',
      cardId: card._id,
      actorId: req.user.id,
      message: `created ${card.title}`
    })

    res.status(201).json({ message: 'Card created', payload: card })
  } catch (err) {
    next(err)
  }
})

// PUT /boards-api/cards/:id - update or move card
boardsApp.put('/cards/:id', write, async (req, res, next) => {
  try {
    const card = await findAccessibleCard(req.params.id, req.user.id)
    if (!card) return res.status(404).json({ message: 'Card not found' })
    if (req.body.listId) {
      const targetList = await findAccessibleList(req.body.listId, req.user.id)
      if (
        !targetList ||
        targetList.projectId.toString() !== card.projectId.toString()
      ) {
        return res.status(400).json({ message: 'Invalid target list' })
      }
    }

    const updatePayload = cleanCardPayload(req.body, { partial: true })

    const updated = await taskModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: 'Card not found' })

    getIO().to(`board:${updated.projectId}`).emit('card-updated', updated)
    emitBoardActivity(updated.projectId, {
      type: 'card-updated',
      cardId: updated._id,
      actorId: req.user.id,
      message: `updated ${updated.title}`
    })

    res.status(200).json({ message: 'Card updated', payload: updated })
  } catch (err) {
    next(err)
  }
})

// POST /boards-api/cards/:id/attachments
boardsApp.post(
  '/cards/:id/attachments',
  write,
  upload.single('attachment'),
  async (req, res, next) => {
    try {
      const card = await findAccessibleCard(req.params.id, req.user.id)
      if (!card) return res.status(404).json({ message: 'Card not found' })
      if (!req.file) {
        return res.status(400).json({ message: 'Image attachment is required' })
      }

      const image = await uploadImageFile(req.file, 'card_attachments')
      const attachment = {
        name: image.fileName,
        url: image.url,
        publicId: image.publicId,
        fileType: image.fileType,
        size: image.size
      }

    card.attachment = [...(card.attachment || []), attachment]
    if (!card.coverImage?.url && image.fileType?.startsWith('image/')) {
      card.coverImage = { url: image.url, publicId: image.publicId }
    }
    await card.save()

    getIO().to(`board:${card.projectId}`).emit('card-updated', card)
    emitBoardActivity(card.projectId, {
      type: 'attachment-added',
      cardId: card._id,
      actorId: req.user.id,
      message: `attached ${attachment.name}`
    })

      res.status(201).json({
        message: 'Attachment uploaded',
        payload: card
      })
    } catch (err) {
      next(err)
    }
  }
)

// DELETE /boards-api/cards/:id
boardsApp.delete('/cards/:id', write, async (req, res, next) => {
  try {
    const accessibleCard = await findAccessibleCard(req.params.id, req.user.id)
    if (!accessibleCard)
      return res.status(404).json({ message: 'Card not found' })

    const card = await taskModel.findByIdAndDelete(req.params.id)
    if (!card) return res.status(404).json({ message: 'Card not found' })

    getIO().to(`board:${card.projectId}`).emit('card-deleted', {
      cardId: req.params.id,
      listId: card.listId?.toString()
    })
    emitBoardActivity(card.projectId, {
      type: 'card-deleted',
      cardId: card._id,
      actorId: req.user.id,
      message: `deleted ${card.title}`
    })

    res.status(200).json({ message: 'Card deleted' })
  } catch (err) {
    next(err)
  }
})

// PUT /boards-api/lists/:id/cards/reorder
boardsApp.put('/lists/:id/cards/reorder', write, async (req, res, next) => {
  try {
    const list = await findAccessibleList(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    const { orderedIds } = req.body
    if (!Array.isArray(orderedIds))
      return res.status(400).json({ message: 'orderedIds array required' })
    const matchingCards = await taskModel.countDocuments({
      _id: { $in: orderedIds },
      listId: req.params.id,
      isActive: true
    })
    if (matchingCards !== orderedIds.length) {
      return res.status(400).json({ message: 'Invalid card order payload' })
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        taskModel.findByIdAndUpdate(id, { order: index })
      )
    )

    getIO()
      .to(`board:${list.projectId}`)
      .emit('cards-reordered', { listId: req.params.id, orderedIds })

    res.status(200).json({ message: 'Cards reordered' })
  } catch (err) {
    next(err)
  }
})

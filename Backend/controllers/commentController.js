// commentController controller: request handlers and domain-side persistence logic.
import { CommentModel } from '../models/CommentModel.js'
import { taskModel } from '../models/Taskmodel.js'
import { createActivity } from './ActivityController.js'
import { createNotification } from './notificationController.js'

//create comment
export const createComment = async (req, res, next) => {
  try {
    const { taskId, body } = req.body

    if (!taskId || !body?.trim()) {
      return res.status(400).json({ message: 'taskId and body are required' })
    }

    const task = await taskModel.findById(taskId)
    if (!task) return res.status(404).json({ message: 'Task not found' })

    const comment = await CommentModel.create({
      task: taskId,
      author: req.user.id,
      body: body.trim()
    })

    //log activity - non-blocking
    createActivity({
      actor: req.user.id,
      action: 'COMMENT_ADDED',
      target: comment._id,
      targetModel: 'Comment',
      project: task.projectId
    }).catch(() => {})

    //notify card assignee if different from commenter
    if (task.memberId && task.memberId.toString() !== req.user.id) {
      createNotification({
        userId: task.memberId.toString(),
        message: `New comment on card "${task.title}"`,
        type: 'card'
      }).catch(() => {})
    }

    const populated = await CommentModel.findById(comment._id).populate(
      'author',
      'name email profilePic'
    )

    res.status(201).json({ message: 'Comment created', payload: populated })
  } catch (err) {
    next(err)
  }
}

//get comments by task
export const getCommentsByTask = async (req, res, next) => {
  try {
    const comments = await CommentModel.find({ task: req.params.taskId })
      .populate('author', 'name email profilePic')
      .sort({ createdAt: -1 })

    res.status(200).json({ message: 'Comments fetched', payload: comments })
  } catch (err) {
    next(err)
  }
}

//update comment
export const updateComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    comment.body = req.body.body?.trim() || comment.body
    const updated = await comment.save()

    const populated = await CommentModel.findById(updated._id).populate(
      'author',
      'name email profilePic'
    )

    res.status(200).json({ message: 'Comment updated', payload: populated })
  } catch (err) {
    next(err)
  }
}

//delete comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    const isAuthor = comment.author.toString() === req.user.id
    const isAdminOrManager = ['ADMIN', 'MANAGER'].includes(req.user.role)

    if (!isAuthor && !isAdminOrManager) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await comment.deleteOne()

    res.status(200).json({ message: 'Comment deleted' })
  } catch (err) {
    next(err)
  }
}



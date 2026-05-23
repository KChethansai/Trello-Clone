// ActivityController controller: request handlers and domain-side persistence logic.
import { ActivityModel } from '../models/Activity.js'
import { logger } from '../utils/logger.js'

//internal helper - called from controllers, never throws
export const createActivity = async ({
  actor,
  action,
  target,
  targetModel,
  project
}) => {
  try {
    const activity = await ActivityModel.create({
      actor,
      action,
      target,
      targetModel,
      project: project || undefined
    })
    return activity
  } catch (err) {
    logger.error('Activity log error:', err.message)
  }
}

//get activities for a project
export const getActivities = async (req, res, next) => {
  try {
    const activities = await ActivityModel.find({
      project: req.params.projectId
    })
      .populate('actor', 'name email')
      .sort({ createdAt: -1 })
      .limit(100)

    res.status(200).json({ message: 'Activities fetched', payload: activities })
  } catch (err) {
    next(err)
  }
}

//get single activity
export const getActivity = async (req, res, next) => {
  try {
    const activity = await ActivityModel.findById(
      req.params.activityId
    ).populate('actor', 'name email')
    if (!activity)
      return res.status(404).json({ message: 'Activity not found' })
    res.status(200).json({ message: 'Activity fetched', payload: activity })
  } catch (err) {
    next(err)
  }
}

//delete activity
export const deleteActivity = async (req, res, next) => {
  try {
    await ActivityModel.findByIdAndDelete(req.params.activityId)
    res.status(200).json({ message: 'Activity deleted' })
  } catch (err) {
    next(err)
  }
}



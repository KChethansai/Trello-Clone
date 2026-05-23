// ProjectManagercontroller controller: request handlers and domain-side persistence logic.
import { projectModel } from '../models/ProjectModel.js'
import { WorkspaceModel } from '../models/Workspace.js'

// READ ALL PROJECTS CREATED BY LOGGED-IN USER
export const read_own_projects = async (req, res) => {
  try {
    const userId = req.user.id

    const projects = await projectModel
      .find({
        creatorId: userId,
        status: true
      })
      .populate('workspace', 'name')
      .populate('members', 'name email')

    res.status(200).json({
      message: 'Projects fetched successfully',
      payload: projects
    })
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      reason: err.message
    })
  }
}

// CREATE PROJECT
export const create_project = async (req, res) => {
  try {
    const projectObj = req.body

    // CHECK WORKSPACE EXISTS
    const workspace = await WorkspaceModel.findById(projectObj.workspace)

    if (!workspace) {
      return res.status(404).json({
        message: 'Workspace not found'
      })
    }

    // VALIDATE MEMBERS BELONG TO WORKSPACE
    if (projectObj.members) {
      const invalidMembers = []

      for (const each of projectObj.members) {
        const isMember = workspace.members.some(
          (m) => m.user && m.user.toString() === each.toString()
        )

        if (!isMember) {
          invalidMembers.push(each)
        }
      }

      if (invalidMembers.length > 0) {
        return res.status(400).json({
          message: 'Some members are not part of workspace',
          invalidMembers
        })
      }
    }

    // CREATE PROJECT
    const project = new projectModel({
      ...projectObj,
      creatorId: req.user.id
    })

    await project.save()

    res.status(201).json({
      message: 'Project created successfully',
      payload: project
    })
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      reason: err.message
    })
  }
}

// GET SINGLE PROJECT
export const get_single_project = async (req, res) => {
  try {
    const project = await projectModel
      .findById(req.params.id)
      .populate('workspace', 'name')
      .populate('members', 'name email')

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    res.status(200).json({
      message: 'Project fetched successfully',
      payload: project
    })
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      reason: err.message
    })
  }
}

// EDIT PROJECT
export const edit_project = async (req, res) => {
  try {
    const userId = req.user.id

    const projectId = req.params.id

    const project = await projectModel.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    // ONLY CREATOR CAN EDIT
    if (project.creatorId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'You are not allowed to edit this project'
      })
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    res.status(200).json({
      message: 'Project updated successfully',
      payload: updatedProject
    })
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      reason: err.message
    })
  }
}

// SOFT DELETE PROJECT
export const delete_project = async (req, res) => {
  try {
    const userId = req.user.id

    const projectId = req.params.id
    const new_staus = req.body
    const project = await projectModel.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    // ONLY CREATOR CAN DELETE
    if (project.creatorId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'You are not allowed to delete this project'
      })
    }

    // SOFT DELETE
    project.status = new_staus

    await project.save()

    res.status(200).json({
      message: 'Project deleted successfully',
      payload: project
    })
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      reason: err.message
    })
  }
}



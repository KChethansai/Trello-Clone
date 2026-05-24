import Template from "../models/template.js";
import { projectModel } from "../models/ProjectModel.js";
import { WorkspaceModel } from "../models/Workspace.js";

const checkWsManager = async (projectRef, userId) => {
  if (!projectRef) return false;
  const project = await projectModel.findById(projectRef);
  if (!project || !project.workspace) return false;
  const workspace = await WorkspaceModel.findById(project.workspace);
  if (!workspace) return false;
  if (workspace.owner?.toString() === userId) return true;
  const member = workspace.members?.find((m) => m.user?.toString() === userId);
  return ['ADMIN', 'MANAGER'].includes(member?.role);
};

// create template
export const createTemplate = async (req, res) => {
  try {

    const {
      title,
      description,
      category,
      creatorName,
      images,
      isPublished,
      isEditable
    } = req.body;

    const template = await Template.create({
      title,
      description,
      category,
      creatorId: req.user.id,
      creatorName,
      images,
      isPublished: isPublished || false,
      isEditable: isEditable || false
    });

    res.status(201).json({
      message: "Template created successfully",
      payload: template,
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      reason: error.message,
    });

  }
};

// get all templates
export const getTemplates = async (req, res) => {
  try {

    const userId = req.user.id;

    const templates = await Template.find({ type: { $ne: 'fav-marker' } })
      .sort({ createdAt: -1 });

    const publishedProjects = await projectModel
      .find({ isPublished: true, status: true })
      .populate('creatorId', 'name')
      .sort({ createdAt: -1 });

    //load fav-markers for this user's project favourites
    const favMarkers = await Template.find({
      type: 'fav-marker',
      favourites: userId
    }).select('projectRef');

    const favProjectIds = new Set(
      favMarkers.map((m) => m.projectRef?.toString())
    );

    const allTemplates = [

      ...templates.map((t) => ({
        ...t.toObject(),
        favourite: t.favourites?.some(
          (fav) => fav.toString() === userId
        ),
        type: 'template'
      })),

      ...publishedProjects.map((p) => ({
        _id: p._id,
        title: p.title,
        description: p.description,
        //use publishDetails.category when set, else 'Project'
        category: p.publishDetails?.category?.trim() || 'Project',
        creatorName: p.creatorId?.name || 'Unknown',
        images: p.img ? [p.img] : [],
        favourite: favProjectIds.has(p._id.toString()),
        isEditable: p.isEditable,
        isPublished: p.isPublished,
        publishDetails: p.publishDetails,
        createdAt: p.createdAt,
        creatorId: p.creatorId?._id,
        type: 'project'
      }))
    ];

    res.status(200).json({
      message: "Templates fetched successfully",
      payload: allTemplates,
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      reason: error.message,
    });

  }
};

// get single template
export const getTemplateById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid template id" });
    }

    //try Template collection first
    let payload = await Template.findById(id);
    let type = 'template';

    //fall back to published project
    if (!payload) {
      const project = await projectModel
        .findById(id)
        .populate('creatorId', 'name');

      if (!project || !project.isPublished || project.status === false) {
        return res.status(404).json({ message: "Template not found" });
      }

      payload = {
        _id: project._id,
        title: project.title,
        description: project.description,
        category: project.publishDetails?.category?.trim() || 'Project',
        creatorName: project.creatorId?.name || 'Unknown',
        creatorId: project.creatorId?._id,
        images: project.img ? [project.img] : [],
        isPublished: project.isPublished,
        isEditable: project.isEditable,
        isViewOnly: !project.isEditable,
        allowPublicEdit: project.isEditable,
        createdAt: project.createdAt,
        type: 'project'
      };

    } else {
      payload = { ...payload.toObject(), type };
    }

    res.status(200).json({
      message: "Template fetched successfully",
      payload
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      reason: error.message,
    });

  }
};

// toggle favourite — handles both Template docs and project-type items
// toggle favourite — handles both Template docs and project-type items
export const toggleFavourite = async (req, res) => {
  try {

    const { id } = req.params;
    const userId = req.user.id;

    // check if template exists
    const template = await Template.findOne({
      _id: id,
      type: { $ne: 'fav-marker' }
    });

    // REAL TEMPLATE
    if (template) {

      // ensure favourites exists
      if (!template.favourites) {
        template.favourites = [];
      }

      const alreadyFav = template.favourites.some(
        (fav) => fav.toString() === userId
      );

      if (alreadyFav) {

        template.favourites = template.favourites.filter(
          (fav) => fav.toString() !== userId
        );

      } else {

        template.favourites.push(userId);

      }

      await template.save();

      return res.status(200).json({
        message: "Favourite updated successfully",
        payload: template,
      });
    }

    // PROJECT FAVOURITE
    let marker = await Template.findOne({
      type: 'fav-marker',
      projectRef: id
    });

    // create marker if missing
    if (!marker) {

      marker = await Template.create({
        type: 'fav-marker',
        projectRef: id,
        favourites: [userId],
        title: `fav-marker-${id}`,
        creatorId: userId,
        creatorName: 'system',
        category: 'system',
        isPublished: false,
        isEditable: false
      });

    } else {

      // ensure favourites exists
      if (!marker.favourites) {
        marker.favourites = [];
      }

      const alreadyFav = marker.favourites.some(
        (fav) => fav.toString() === userId
      );

      if (alreadyFav) {

        marker.favourites = marker.favourites.filter(
          (fav) => fav.toString() !== userId
        );

      } else {

        marker.favourites.push(userId);

      }

      await marker.save();
    }

    return res.status(200).json({
      message: "Favourite updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
      reason: error.message,
    });

  }
};

// toggle published
export const togglePublished = async (req, res) => {
  try {

    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const isOwner = template.creatorId.toString() === req.user.id.toString();
    const isWsManager = await checkWsManager(template.projectRef || template._id, req.user.id);
    const hasGlobalRole = ['ADMIN', 'MANAGER', 'MEMBER'].includes(req.user.role);

    if (!isOwner && !isWsManager && !hasGlobalRole) {
      return res.status(403).json({ message: "Not authorized" });
    }

    template.isPublished = !template.isPublished;

    await template.save();

    res.status(200).json({
      message: "Published status updated successfully",
      payload: template,
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      reason: error.message,
    });

  }
};

// update template
export const updateTemplate = async (req, res) => {
  try {

    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const isOwner = String(template.creatorId) === String(req.user.id);
    const isWsManager = await checkWsManager(template.projectRef || template._id, req.user.id);
    const canEdit = isOwner || 
                   isWsManager ||
                   ['ADMIN', 'MANAGER', 'MEMBER'].includes(req.user.role) || 
                   (!template.isPublished && template.isEditable);

    if (!canEdit) {
      return res.status(403).json({
        message: "You do not have permission to edit this template",
      });
    }

    const { title, description, category, images, isPublished, publishDetails } = req.body;

    if (title !== undefined) template.title = title;
    if (description !== undefined) template.description = description;
    if (category !== undefined) template.category = category;
    if (images !== undefined) template.images = images;
    if (isPublished !== undefined) template.isPublished = isPublished;
    if (publishDetails !== undefined) template.publishDetails = publishDetails;

    await template.save();

    res.status(200).json({
      message: "Template updated successfully",
      payload: template,
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      reason: error.message,
    });

  }
};

// delete / unpublish template
export const deleteTemplate = async (req, res) => {
  try {

    const { id } = req.params;
    const isAdmin = req.user.role === 'ADMIN';

    //try Template collection first
    const template = await Template.findOne({
      _id: id,
      type: { $ne: 'fav-marker' }
    });

    if (template) {

      const isOwner = String(template.creatorId) === String(req.user.id);
      const isWsManager = await checkWsManager(template.projectRef || template._id, req.user.id);

      if (!isOwner && !isWsManager && !['ADMIN', 'MANAGER', 'MEMBER'].includes(req.user.role)) {
        return res.status(403).json({
          message: "You do not have permission to delete this template",
        });
      }

      await Template.findByIdAndDelete(id);

      return res.status(200).json({ message: "Template deleted successfully" });

    }

    //fall back to project — unpublish to remove from templates list
    const project = await projectModel.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Template not found" });
    }

    const isOwner = String(project.creatorId) === String(req.user.id);
    const isWsManager = await checkWsManager(project._id, req.user.id);

    if (!isOwner && !isWsManager && !['ADMIN', 'MANAGER', 'MEMBER'].includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to remove this template",
      });
    }

    await projectModel.findByIdAndUpdate(id, { isPublished: false });

    return res.status(200).json({ message: "Template removed successfully" });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      reason: error.message,
    });

  }
};

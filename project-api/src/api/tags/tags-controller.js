import {
  addNewTag,
  getAllTags,
  getOneTagById,
  removeTag,
  updateTag,
} from "./tags-model.js";

/**
 * Direct the GET all tags-request to model
 */
const getTags = async (req, res, next) => {
  try {
    const tags = await getAllTags();
    res.status(200).json({ message: "Tags found", tags });
  } catch (error) {
    next({ status: 500, message: "Error getting tags" });
  }
};

/**
 * Direct the GET tag by ID-request to model
 */
const getTagById = async (req, res, next) => {
  try {
    const tag = await getOneTagById(req.params.id);
    if (tag) {
      res.status(200).json({ message: "Tag found", tag });
    } else {
      next({ status: 404, message: "Tag not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting tag" });
  }
};

/**
 * Direct the POST tag-request to model
 */
const postTag = async (req, res, next) => {
  try {
    const tagInfo = req.body;
    const result = await addNewTag(tagInfo);
    if (result) {
      res.status(200).json({ message: "New tag added", result });
    } else {
      next({ status: 400, message: "Could not add tag" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding tag" });
  }
};

/**
 * Direct the DELETE tag-request to model
 */
const deleteTag = async (req, res, next) => {
  try {
    const tagId = req.params.id;
    const result = await removeTag(tagId);
    if (result) {
      res.status(200).json({ message: "Tag deleted", result });
    } else {
      next({ status: 400, message: "Could not delete tag" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting tag" });
  }
};

/**
 * Direct the PUT tag-request to model
 */
const putTag = async (req, res, next) => {
  try {
    const tagId = req.params.id;
    const tagInfo = req.body;
    const result = await updateTag(tagId, tagInfo);
    if (result) {
      res.status(200).json({ message: "Tag updated", result });
    } else {
      next({ status: 400, message: "Could not update tag" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating tag" });
  }
};

export { getTags, getTagById, deleteTag, postTag, putTag };

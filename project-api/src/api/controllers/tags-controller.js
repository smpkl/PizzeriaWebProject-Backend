import {
  addNewTag,
  getAllTags,
  getOneTagById,
  removeTag,
  updateTag,
} from "../models/tags-model.js";

/**
 * Direct the GET all tags-request to model
 */
const getTags = async (req, res) => {
  try {
    const tags = await getAllTags();
    res.status(200).json({ message: "Tags found", tags });
  } catch (error) {
    res.status(500).json({ message: "Error getting tags" });
  }
};

/**
 * Direct the GET tag by ID-request to model
 */
const getTagById = async (req, res) => {
  try {
    const tag = await getOneTagById(req.params.id);
    if (tag) {
      res.status(200).json({ message: "Tag found", tag });
    } else {
      res.status(404).json({ message: "Tag not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting tag" });
  }
};

/**
 * Direct the POST tag-request to model
 */
const postTag = async (req, res) => {
  try {
    const tagInfo = req.body;
    const result = await addNewTag(tagInfo);
    if (result) {
      res.status(200).json({ message: "New tag added", result });
    } else {
      res.status(400).json({ message: "Could not add tag" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding tag" });
  }
};

/**
 * Direct the DELETE tag-request to model
 */
const deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const result = await removeTag(tagId);
    if (result) {
      res.status(200).json({ message: "Tag deleted", result });
    } else {
      res.status(400).json({ message: "Could not delete tag" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting tag" });
  }
};

/**
 * Direct the PUT tag-request to model
 */
const putTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const tagInfo = req.body;
    const result = await updateTag(tagId, tagInfo);
    if (result) {
      res.status(200).json({ message: "Tag updated", result });
    } else {
      res.status(400).json({ message: "Could not update tag" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating tag" });
  }
};

export { getTags, getTagById, deleteTag, postTag, putTag };

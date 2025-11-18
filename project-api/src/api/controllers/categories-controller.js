import {
  findAllCategories,
  findCategoryById,
  addNewCategory,
  modifyCategoryById,
  removeCategory,
} from "../models/categories-model";

/**
 * Direct the GET all categories-request to model
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await findAllCategories();
    res.status(200).json({ message: "Categories found", categories });
  } catch (error) {
    res.status(500).json({ message: "Error getting categories" });
  }
};

/**
 * Direct the GET category by ID-request to model
 */
const getCategoryById = async (req, res) => {
  try {
    const [category] = await findCategoryById(req.params.id);
    if (category) {
      res.status(200).json({ message: "Category found", category });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting category" });
  }
};

/**
 * Direct the POST category-request to model
 */
const postCategory = async (req, res) => {
  try {
    const categInfo = req.body;
    const result = await addNewCategory(categInfo);
    if (result) {
      res.status(200).json({ message: "New category added", result });
    } else {
      res.status(400).json({ message: "Could not add category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding categories" });
  }
};

/**
 * Direct the DELETE category-request to model
 */
const deleteCategory = async (req, res) => {
  try {
    const categId = req.params.id;
    const result = await removeCategory(categId);
    if (result) {
      res.status(200).json({ message: "Category deleted", result });
    } else {
      res.status(400).json({ message: "Could not delete category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

/**
 * Direct the PUT category-request to model
 */
const putCategory = async (req, res) => {
  try {
    const categId = req.params.id;
    const categInfo = req.body;
    const result = await modifyCategoryById(categId, categInfo);
    if (result) {
      res.status(200).json({ message: "Category updated", result });
    } else {
      res.status(400).json({ message: "Could not update category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

export {
  getAllCategories,
  getCategoryById,
  deleteCategory,
  postCategory,
  putCategory,
};

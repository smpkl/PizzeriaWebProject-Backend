import {
  findAllCategories,
  findCategoryById,
  modifyCategoryById,
  addNewCategory,
  removeCategory,
} from "../models/categories-model.js";

const getAllCategories = async (req, res) => {
  try {
    const results = await findAllCategories();
    res.status(200).json({ message: "Categories found", results });
  } catch (error) {
    res.status(500).json({ message: "Error getting categories" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const results = await findCategoryById(req.params.id);
    console.log(results);
    if (results) {
      res.status(200).json({ message: "Category found", results });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting category" });
  }
};

const postCategory = async (req, res) => {
  try {
    const newCategory = req.body;
    const result = await addNewCategory(newCategory);
    if (result.orderId) {
      res.status(200).json({ message: "New category added", result });
    } else {
      res.status(400).json({ message: "Could not add category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding category" });
  }
};

const putCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const newCategoryInfo = req.body;
    const result = await modifyCategoryById(categoryId, newCategoryInfo);
    if (result.categoryId) {
      res.status(200).json({ message: "Category info updated", result });
    } else {
      res.status(400).json({ message: "Could not update category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const result = await removeCategory(categoryId);
    console.log(result);
    if (result.categoryId) {
      res.status(200).json({
        message: "Category deleted",
        result,
      });
    } else {
      res.status(400).json({
        message: "Could not delete category",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

export {
  getAllCategories,
  getCategoryById,
  postCategory,
  putCategory,
  deleteCategory,
};

import {
  findAllCategories,
  findCategoryById,
  addNewCategory,
  modifyCategoryById,
  removeCategory,
} from "./categories-model.js";

/**
 * Direct the GET all categories-request to model
 */
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await findAllCategories();
    res.status(200).json({ message: "Categories found", categories });
  } catch (error) {
    next({ status: 500, message: "Error getting categories" });
  }
};

/**
 * Direct the GET category by ID-request to model
 */
const getCategoryById = async (req, res, next) => {
  try {
    const category = await findCategoryById(req.params.id);
    if (category) {
      res.status(200).json({ message: "Category found", category });
    } else {
      next({ status: 404, message: "Category not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting category" });
  }
};

/**
 * Direct the POST category-request to model
 */
const postCategory = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const categInfo = req.body;
    const result = await addNewCategory(categInfo);
    if (result) {
      res.status(200).json({ message: "New category added", result });
    } else {
      next({ status: 400, message: "Could not add category" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding categories" });
  }
};

/**
 * Direct the DELETE category-request to model
 */
const deleteCategory = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const categId = req.params.id;
    const result = await removeCategory(categId);
    if (result) {
      res.status(200).json({ message: "Category deleted", result });
    } else {
      next({ status: 400, message: "Could not delete category" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting category" });
  }
};

/**
 * Direct the PUT category-request to model
 */
const putCategory = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const categId = req.params.id;
    const categInfo = req.body;
    const result = await modifyCategoryById(categId, categInfo);
    if (result) {
      res.status(200).json({ message: "Category updated", result });
    } else {
      next({ status: 400, message: "Could not update category" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating category" });
  }
};

export {
  getAllCategories,
  getCategoryById,
  deleteCategory,
  postCategory,
  putCategory,
};

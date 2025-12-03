import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { body } from "express-validator";
import { validationErrors } from "../../middlewares/error-handler.js";

import {
  getAllCategories,
  getCategoryById,
  postCategory,
  deleteCategory,
  putCategory,
} from "./categories-controller.js";

const categoriesRouter = express.Router();

const categoryValidationChain = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Category name cannot be empty.")
      .bail()
      .isLength({ min: 2, max: 50 })
      .withMessage("Category name must be between 2 to 50 characters long."),
  ];
};

const categoryPutValidationChain = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Category name must be between 2 to 50 characters long."),
  ];
};

// Routes related to categories:
categoriesRouter
  .route("/")
  .get(getAllCategories)
  .post(
    authenticateToken,
    categoryValidationChain(),
    validationErrors,
    postCategory
  );

categoriesRouter
  .route("/:id")
  .get(getCategoryById)
  .delete(authenticateToken, deleteCategory)
  .put(
    authenticateToken,
    categoryPutValidationChain(),
    validationErrors,
    putCategory
  );

export default categoriesRouter;

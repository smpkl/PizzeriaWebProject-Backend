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

/**
 * @api {get} /categories Get all categories
 * @apiName GetAllCategories
 * @apiGroup Categories
 *
 * @apiSuccess {Object} message Categories found.
 * @apiSuccess {Object[]} categories List of categories.
 *
 * @apiError (500 ServerError) InternalError Error categories
 */
categoriesRouter.route("/").get(getAllCategories);

/**
 * @api {post} /categories Create a new category
 * @apiName PostCategory
 * @apiGroup Categories
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String{2..50}} name Category name.
 *
 * @apiSuccess {Object} message New category added.
 * @apiSuccess {Object} categoryId Created category object's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden You don't have permission to create category.
 *
 * @apiError (400 ValidationError) NameTooShort Name is shorter than 2 characters.
 * @apiError (400 ValidationError) NameTooLong Name is longer than 50 characters.
 *
 * @apiError (500 ServerError) InternalError Error adding announcement.
 */
categoriesRouter
  .route("/")
  .post(
    authenticateToken,
    categoryValidationChain(),
    validationErrors,
    postCategory
  );

/**
 * @api {get} /categories/:id Get category by its ID
 * @apiName GetCategoryById
 * @apiGroup Categories
 *
 * @apiParam {Number} id Category's unique ID.
 *
 * @apiSuccess {Object} success message Category found.
 * @apiSuccess {Object} category Category data.
 *
 * @apiError (404 NotFound) NotFound Category not found.
 * @apiError (500 ServerError) InternalError Error getting category.
 */
categoriesRouter.route("/:id").get(getCategoryById);

/**
 * @api {delete} /categories/:id Delete a category
 * @apiName DeleteCategory
 * @apiGroup Categories
 *
 * @apiParam {Number} id Category's unique ID
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object} message Category deleted.
 * @apiSuccess {Object} categoryId Category object's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden You don't have permission to delete category.
 *
 * @apiError (400 BadRequest) BadRequest Could not delete category.
 *
 * @apiError (500 ServerError) InternalError Error deleting category.
 */
categoriesRouter.route("/:id").delete(authenticateToken, deleteCategory);

/**
 * @api {put} /categories Update a category
 * @apiName PutCategory
 * @apiGroup Categories
 *
 * @apiParam {Number} id Category's unique ID
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String{2..50}} name Category name.
 *
 * @apiSuccess {Object} message Category updated.
 * @apiSuccess {Object} categoryId Category object's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden You don't have permission to update category.
 *
 * @apiError (400 ValidationError) NameTooShort Name is shorter than 2 characters.
 * @apiError (400 ValidationError) NameTooLong Name is longer than 50 characters.
 *
 * @apiError (500 ServerError) InternalError Error updating announcement.
 */
categoriesRouter
  .route("/:id")
  .put(
    authenticateToken,
    categoryPutValidationChain(),
    validationErrors,
    putCategory
  );

export default categoriesRouter;

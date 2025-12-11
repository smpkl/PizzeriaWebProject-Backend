import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { body } from "express-validator";
import { validationErrors } from "../../middlewares/error-handler.js";
import { upload, createCardIMG } from "../../middlewares/uploads.js";

import {
  deleteMeal,
  getAllMeals,
  getMealById,
  postMeal,
  putMeal,
  getMealProducts,
  postMealProduct,
  deleteMealProduct,
} from "./meals-controller.js";

const mealsRouter = express.Router();

const mealValidationChain = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Meal name cannot be empty.")
      .bail()
      .isLength()
      .withMessage("Meal name must be between 2 to 50 characters long."),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Meal price cannot be empty")
      .bail()
      .isFloat()
      .withMessage("Meal price must be valid (decimal) number."),
  ];
};

const mealPutValidationChain = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength()
      .withMessage("Meal name must be between 2 to 50 characters long."),
    body("price")
      .optional()
      .trim()
      .isFloat()
      .withMessage("Meal price must be valid (decimal) number."),
  ];
};

/**
 * @api {get} /meals Get all meals
 * @apiName GetAllMeals
 * @apiGroup Meals
 *
 * @apiSuccess {String} message Meals found.
 * @apiSuccess {Object[]} meals List of meals.
 * @apiSuccess {Number} meals.id Meal ID.
 * @apiSuccess {String} meals.name Meal name.
 * @apiSuccess {Number} meals.price Meal price.
 * @apiSuccess {String} [meals.filename] Meal image filename.
 *
 * @apiError (500 ServerError) Error getting meals.
 */
mealsRouter
  .route("/")
  .get(getAllMeals)
  /**
   * @api {post} /meals Create a new meal
   * @apiName PostMeal
   * @apiGroup Meals
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiParam (FormData) {File} [file] Meal image file.
   *
   * @apiBody {String} name Meal name.
   * @apiBody {Number} price Meal price.
   * @apiBody {String} [filename] Image filename (set automatically from upload).
   *
   * @apiSuccess {String} message New meal added.
   * @apiSuccess {Object} result Result object.
   * @apiSuccess {Number} result.mealId New meal ID.
   *
   * @apiError (401 Unauthorized) Unauthorized.
   * @apiError (403 Forbidden) Forbidden.
   * @apiError (400 BadRequest) Could not add meal.
   * @apiError (500 ServerError) Error adding meal.
   */
  .post(
    authenticateToken,
    upload.single("file"),
    createCardIMG,
    mealValidationChain(),
    validationErrors,
    postMeal
  );

/**
 * @api {get} /meals/:id Get meal by ID
 * @apiName GetMealById
 * @apiGroup Meals
 *
 * @apiParam {Number} id Meal ID.
 *
 * @apiSuccess {String} message Meal found.
 * @apiSuccess {Object} meal Meal object.
 * @apiSuccess {Number} meal.id Meal ID.
 * @apiSuccess {String} meal.name Meal name.
 * @apiSuccess {Number} meal.price Meal price.
 * @apiSuccess {String} [meal.filename] Meal image filename.
 *
 * @apiError (404 NotFound) Meal not found.
 * @apiError (500 ServerError) Error getting meal.
 */

/**
 * @api {put} /meals/:id Update meal
 * @apiName PutMeal
 * @apiGroup Meals
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Meal ID.
 * @apiParam (FormData) {File} [file] New image file.
 *
 * @apiBody {String} [name] Meal name.
 * @apiBody {Number} [price] Meal price.
 * @apiBody {String} [filename] Image filename (set automatically from upload).
 *
 * @apiSuccess {String} message Meal info updated.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.mealId Updated meal ID.
 *
 * @apiError (401 Unauthorized) Unauthorized.
 * @apiError (403 Forbidden) Forbidden.
 * @apiError (400 BadRequest) Could not update meal.
 * @apiError (500 ServerError) Error updating meal.
 */

/**
 * @api {delete} /meals/:id Delete meal
 * @apiName DeleteMeal
 * @apiGroup Meals
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Meal ID.
 *
 * @apiSuccess {String} message Meal deleted.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.meal_Id Deleted meal ID.
 *
 * @apiError (401 Unauthorized) Unauthorized.
 * @apiError (403 Forbidden) Forbidden.
 * @apiError (400 BadRequest) Could not delete meal.
 * @apiError (500 ServerError) Error deleting meal.
 */
mealsRouter
  .route("/:id")
  .get(getMealById)
  .put(
    authenticateToken,
    upload.single("file"),
    createCardIMG,
    mealPutValidationChain(),
    validationErrors,
    putMeal
  )
  .delete(authenticateToken, deleteMeal);

/**
 * @api {get} /meals/:mealId/products Get products in a meal
 * @apiName GetMealProducts
 * @apiGroup Meals
 *
 * @apiParam {Number} mealId Meal ID.
 *
 * @apiSuccess {String} message Meal products found.
 * @apiSuccess {Object[]} products Products linked to this meal.
 *
 * @apiError (404 NotFound) Meal products not found.
 * @apiError (500 ServerError) Error getting meal products.
 */
mealsRouter.route("/:mealId/products").get(getMealProducts);

/**
 * @api {post} /meals/:mealId/products Add product to a meal
 * @apiName PostMealProduct
 * @apiGroup Meals
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} mealId Meal ID.
 *
 * @apiBody {Number} product_id Product ID to attach.
 *
 * @apiSuccess {String} message New product added to a meal.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.product_id Product ID.
 * @apiSuccess {Number} result.meal_id Meal ID.
 *
 * @apiError (401 Unauthorized) Unauthorized.
 * @apiError (403 Forbidden) Forbidden.
 * @apiError (400 BadRequest) Could not add product to a meal.
 * @apiError (500 ServerError) Error adding product to a meal.
 */
mealsRouter
  .route("/:mealId/products")
  .post(authenticateToken, postMealProduct);

/**
 * @api {delete} /meals/:mealId/products/:productId Remove product from a meal
 * @apiName DeleteMealProduct
 * @apiGroup Meals
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} mealId Meal ID.
 * @apiParam {Number} productId Product ID.
 *
 * @apiSuccess {String} message Product removed from a meal.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.product_id Product ID.
 * @apiSuccess {Number} result.meal_id Meal ID.
 *
 * @apiError (401 Unauthorized) Unauthorized.
 * @apiError (403 Forbidden) Forbidden.
 * @apiError (400 BadRequest) Could not remove a product from a meal.
 * @apiError (500 ServerError) Error removing product from a meal.
 */
mealsRouter
  .route("/:mealId/products/:productId")
  .delete(authenticateToken, deleteMealProduct);

export default mealsRouter;

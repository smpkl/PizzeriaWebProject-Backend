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

// Routes related to meals:
mealsRouter
  .route("/")
  .get(getAllMeals)
  .post(
    authenticateToken,
    upload.single("file"),
    createCardIMG,
    mealValidationChain(),
    validationErrors,
    postMeal
  );
mealsRouter
  .route("/:id")
  .get(getMealById)
  .put(
    authenticateToken,
    upload.single("file"),
    createCardIMG,
    mealValidationChain(),
    validationErrors,
    putMeal
  )
  .delete(authenticateToken, deleteMeal);

// Products in the meal (parameter=meal id)
mealsRouter
  .route("/:mealId/products")
  .get(getMealProducts)
  .post(authenticateToken, postMealProduct);

mealsRouter
  .route("/:mealId/products/:productId")
  .delete(authenticateToken, deleteMealProduct); // Delete product from a meal (parameter1=meal id, parameter2=product id)

export default mealsRouter;

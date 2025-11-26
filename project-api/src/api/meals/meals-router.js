import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import {
  deleteMeal,
  getAllMeals,
  getMealById,
  postMeal,
  putMeal,
  getMealProducts,
  postMealProduct,
  deleteMealProduct,
} from "../controllers/meals-controller.js";

const mealsRouter = express.Router();

// Routes related to meals:
mealsRouter.route("/").get(getAllMeals).post(authenticateToken, postMeal);
mealsRouter
  .route("/:id")
  .get(getMealById)
  .put(authenticateToken, putMeal)
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

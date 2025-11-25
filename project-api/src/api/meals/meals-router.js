import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";
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

const mealRouter = express.Router();

// Routes related to meals:
mealRouter.route("/").get(getAllMeals).post(postMeal);
mealRouter.route("/:id").get(getMealById).put(putMeal).delete(deleteMeal);

// Products in the meal (parameter=meal id)
mealRouter
  .route("/:mealId/products")
  .get(getMealProducts)
  .post(postMealProduct);

mealRouter.route("/:mealId/products/:productId").delete(deleteMealProduct); // Delete product from a meal (parameter1=meal id, parameter2=product id)

export default mealRouter;

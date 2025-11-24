import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";
import {
  deleteMeal,
  getAllMeals,
  getMealById,
  getMealProducts,
} from "../controllers/meals-controller.js";

const mealRouter = express.Router();

// Routes related to meals:
mealRouter.route("/").get(getAllMeals).delete(deleteMeal);
mealRouter.route("/:id").get(getMealById);

mealRouter.route("/products/:id").get(getMealProducts); // Get products in the meal by meal id

export default mealRouter;

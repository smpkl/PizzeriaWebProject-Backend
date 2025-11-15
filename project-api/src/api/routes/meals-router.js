import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";
import {
  getAllMeals,
  getMealById,
  getMealProducts,
} from "../controllers/meals-controller.js";

const mealRouter = express.Router();

// Routes related to meals:
adminRouter.route("/").get(getAllMeals);
adminRouter.route("/:id").get(getMealById);

adminRouter.route("/products/:id").get(getMealProducts); // Get products in the meal by meal id

export default mealRouter;

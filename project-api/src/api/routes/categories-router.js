import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllCategories,
  getCategoryById,
  getCategoryProducts,
} from "../controllers/categories-controller.js";

const categoriesRouter = express.Router();

// Routes related to announcements:
categoriesRouter.route("/").get(getAllCategories);
categoriesRouter.route("/:id").get(getCategoryById);

categoriesRouter.route("/products/:id").get(getCategoryProducts); // Get all products in a certain category by category id (i.e. get all beverages, get all pizzas, get all extras etc.)

export default categoriesRouter;

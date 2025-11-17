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

export default categoriesRouter;

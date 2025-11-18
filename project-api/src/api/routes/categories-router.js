import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllCategories,
  getCategoryById,
  postCategory,
  putCategory,
  deleteCategory,
} from "../controllers/categories-controller.js";

const categoriesRouter = express.Router();

// Routes related to announcements:
categoriesRouter.route("/").get(getAllCategories);
categoriesRouter.route("/:id").get(getCategoryById);
categoriesRouter.route("/:id").get(getCategoryProducts);

orderRouter.route("/").post(postCategory);
orderRouter.route("/:id").put(putCategory);
orderRouter.route("/:id").delete(deleteCategory);

export default categoriesRouter;

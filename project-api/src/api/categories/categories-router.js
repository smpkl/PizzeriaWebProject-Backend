import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllCategories,
  getCategoryById,
  postCategory,
  deleteCategory,
  putCategory,
} from "./categories-controller.js";

const categoriesRouter = express.Router();

// Routes related to categories:
categoriesRouter.route("/").get(getAllCategories).post(postCategory);
categoriesRouter
  .route("/:id")
  .get(getCategoryById)
  .delete(deleteCategory)
  .put(putCategory);

export default categoriesRouter;

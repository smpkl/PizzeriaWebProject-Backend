import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";
import {
  getAllProducts,
  getProductById,
  getProductTags,
} from "../controllers/products-controller.js";

const productRouter = express.Router();

adminRouter.route("/").get(getAllProducts);
adminRouter.route("/:id").get(getProductById);

adminRouter.route("/tags/:id").get(getProductTags); // Get all tags for a specific product

export default productRouter;

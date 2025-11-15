import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";
import {
  getAllProducts,
  getProductById,
} from "../controllers/products-controller.js";

const productRouter = express.Router();

adminRouter.route("/products").get(getAllProducts);

adminRouter.route("/products/:id").get(getProductById);

export default productRouter;

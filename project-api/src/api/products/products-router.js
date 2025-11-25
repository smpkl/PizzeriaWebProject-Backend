import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";
import {
  getAllProducts,
  getProductById,
  getAllProductsByCategory,
  getProductsByTagId,
  postProduct,
  postProductTag,
  deleteProductTag,
  putProduct,
  deleteProduct,
} from "./products-controller.js";

const productsRouter = express.Router();

productsRouter.route("/").get(getAllProducts).post(postProduct);
productsRouter
  .route("/:id")
  .get(getProductById)
  .put(putProduct)
  .delete(deleteProduct);

productsRouter.route("/products/:productId/tags").post(postProductTag); // Add a tag to a product (parameter = product id, body = tag_id: (id))
productsRouter
  .route("/products/:productId/tags/:tagId")
  .delete(deleteProductTag); // Remove a tag from a product (parameter1 = product id, parameter2 = tag id)

productsRouter.route("/category/:categoryId").get(getAllProductsByCategory); // Get all products in a specific category (parameter = category id)
productsRouter.route("/tags/:tagId").get(getProductsByTagId); // Get all products with a specific tag

export default productsRouter;

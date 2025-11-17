import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";
import {
  getAllProducts,
  getProductById,
  getAllProductsByCategory,
  postProduct,
  postProductTag,
  deleteProductTag,
  putProduct,
  deleteProduct,
} from "../controllers/products-controller.js";

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
// adminRouter.route("/tags/:id").get(getProductTags); // Get all tags for a specific product (Might no longer be needed since products are returned with their tags)

export default productsRouter;

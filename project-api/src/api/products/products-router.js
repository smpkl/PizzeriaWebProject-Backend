import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { body } from "express-validator";
import { validationErrors } from "../../middlewares/error-handler.js";

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

const productValidationChain = () => {
  return [
    body("name")
      .trim()
      .notEmpty("Product must have a name.")
      .bail()
      .isLength({ min: 3, max: 50 })
      .withMessage("Product name must be between 3 to 50 characters long."),
    body("ingredients")
      .optional()
      .trim()
      .isLength({ max: 700 })
      .withMessage("Product ingredients text limit is 700 characters."),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Product price cannot be empty.")
      .bail()
      .isFloat()
      .withMessage("Product price must be valid (decimal) number."),
    body("category")
      .optional()
      .trim()
      .isInt()
      .withMessage("Product category must be an integer."),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 700 })
      .withMessage("Product description text limit is 700 characters."),
  ];
};

productsRouter
  .route("/")
  .get(getAllProducts)
  .post(
    authenticateToken,
    productValidationChain(),
    validationErrors,
    postProduct
  );

productsRouter
  .route("/:id")
  .get(getProductById)
  .put(
    authenticateToken,
    productValidationChain(),
    validationErrors,
    putProduct
  )
  .delete(authenticateToken, deleteProduct);

productsRouter
  .route("/:productId/tags")
  .post(authenticateToken, postProductTag); // Add a tag to a product (parameter = product id, body = tag_id: (id))

productsRouter
  .route("/:productId/tags/:tagId")
  .delete(authenticateToken, deleteProductTag); // Remove a tag from a product (parameter1 = product id, parameter2 = tag id)

productsRouter.route("/category/:categoryId").get(getAllProductsByCategory); // Get all products in a specific category (parameter = category id)

productsRouter.route("/tags/:tagId").get(getProductsByTagId); // Get all products with a specific tag

export default productsRouter;

import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { body } from "express-validator";
import { validationErrors } from "../../middlewares/error-handler.js";
import { upload, createCardIMG } from "../../middlewares/uploads.js";

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
      .notEmpty()
      .withMessage("Product must have a name.")
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

const productPutValidationChain = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Product name must be between 3 to 50 characters long."),
    body("ingredients")
      .optional()
      .trim()
      .isLength({ max: 700 })
      .withMessage("Product ingredients text limit is 700 characters."),
    body("price")
      .optional()
      .trim()
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

/**
 * @api {get} /products Get all products
 * @apiName GetAllProducts
 * @apiGroup Products
 *
 * @apiSuccess {String} message Products found.
 * @apiSuccess {Object[]} products List of products.
 * @apiSuccess {Number} products.id Product ID.
 * @apiSuccess {String} products.name Product name.
 * @apiSuccess {String} [products.ingredients] Product ingredients.
 * @apiSuccess {Number} products.price Product price.
 * @apiSuccess {Number} [products.category] Category ID.
 * @apiSuccess {String} [products.description] Product description.
 * @apiSuccess {String} [products.filename] Image filename.
 * @apiSuccess {String[]} [products.tags] List of tag titles.
 *
 * @apiError (500 ServerError) InternalError Error getting products.
 */
productsRouter
  .route("/")
  .get(getAllProducts)
  /**
   * @api {post} /products Create a new product
   * @apiName PostProduct
   * @apiGroup Products
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiParam (FormData) {File} [file] Product image file.
   *
   * @apiBody {String{3..50}} name Product name.
   * @apiBody {String{0..700}} [ingredients] Product ingredients text.
   * @apiBody {Number} price Product price (decimal).
   * @apiBody {Number} [category] Category ID.
   * @apiBody {String{0..700}} [description] Product description.
   *
   * @apiSuccess {String} message New product added.
   * @apiSuccess {Object} result Result object.
   * @apiSuccess {Number} result.productId New product ID.
   *
   * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
   * @apiError (403 Forbidden) Forbidden Only admins can create products.
   *
   * @apiError (400 ValidationError) NameInvalid Product name missing or invalid.
   * @apiError (400 ValidationError) PriceInvalid Product price missing or invalid.
   * @apiError (400 ValidationError) IngredientsInvalid Ingredients too long.
   * @apiError (400 ValidationError) DescriptionInvalid Description too long.
   * @apiError (400 ValidationError) CategoryInvalid Category ID is not integer.
   *
   * @apiError (400 BadRequest) CouldNotAdd Could not add product.
   * @apiError (500 ServerError) InternalError Error adding product.
   */
  .post(
    authenticateToken,
    upload.single("file"),
    createCardIMG,
    productValidationChain(),
    validationErrors,
    postProduct
  );

/**
 * @api {get} /products/:id Get product by ID
 * @apiName GetProductById
 * @apiGroup Products
 *
 * @apiParam {Number} id Product ID.
 *
 * @apiSuccess {String} message Product found.
 * @apiSuccess {Object} product Product object.
 * @apiSuccess {Number} product.id Product ID.
 * @apiSuccess {String} product.name Product name.
 * @apiSuccess {String} [product.ingredients] Product ingredients.
 * @apiSuccess {Number} product.price Product price.
 * @apiSuccess {Number} [product.category] Category ID.
 * @apiSuccess {String} [product.description] Product description.
 * @apiSuccess {String} [product.filename] Image filename.
 * @apiSuccess {String[]} [product.tags] List of tag titles.
 *
 * @apiError (404 NotFound) ProductNotFound Product not found.
 * @apiError (500 ServerError) InternalError Error getting product.
 */

/**
 * @api {put} /products/:id Update product
 * @apiName PutProduct
 * @apiGroup Products
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Product ID.
 *
 * @apiParam (FormData) {File} [file] New image file.
   *
 * @apiBody {String{3..50}} [name] Product name.
 * @apiBody {String{0..700}} [ingredients] Product ingredients text.
 * @apiBody {Number} [price] Product price (decimal).
 * @apiBody {Number} [category] Category ID.
 * @apiBody {String{0..700}} [description] Product description.
 *
 * @apiSuccess {String} message Product info updated.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.productId Updated product ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can update products.
 *
 * @apiError (400 ValidationError) NameInvalid Product name invalid.
 * @apiError (400 ValidationError) PriceInvalid Product price invalid.
 * @apiError (400 ValidationError) IngredientsInvalid Ingredients too long.
 * @apiError (400 ValidationError) DescriptionInvalid Description too long.
 * @apiError (400 ValidationError) CategoryInvalid Category ID is not integer.
 *
 * @apiError (400 BadRequest) CouldNotUpdate Could not update product.
 * @apiError (500 ServerError) InternalError Error updating product.
 */

/**
 * @api {delete} /products/:id Delete product
 * @apiName DeleteProduct
 * @apiGroup Products
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Product ID.
 *
 * @apiSuccess {String} message Product deleted.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.productId Deleted product ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can delete products.
 * @apiError (400 BadRequest) CouldNotDelete Could not delete product.
 * @apiError (500 ServerError) InternalError Error deleting product.
 */
productsRouter
  .route("/:id")
  .get(getProductById)
  .put(
    authenticateToken,
    upload.single("file"),
    createCardIMG,
    productPutValidationChain(),
    validationErrors,
    putProduct
  )
  .delete(authenticateToken, deleteProduct);

/**
 * @api {post} /products/:productId/tags Add tag to product
 * @apiName PostProductTag
 * @apiGroup Products
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} productId Product ID.
 *
 * @apiBody {Number} tag_id Tag ID to attach to product.
 *
 * @apiSuccess {String} message New tag added for product.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.product_id Product ID.
 * @apiSuccess {Number} result.tag_id Tag ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can add tags to products.
 * @apiError (400 BadRequest) CouldNotAdd Could not add tag for product.
 * @apiError (500 ServerError) InternalError Error adding tag for product.
 */
productsRouter
  .route("/:productId/tags")
  .post(authenticateToken, postProductTag);

/**
 * @api {delete} /products/:productId/tags/:tagId Remove tag from product
 * @apiName DeleteProductTag
 * @apiGroup Products
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} productId Product ID.
 * @apiParam {Number} tagId Tag ID.
 *
 * @apiSuccess {String} message Tag removed from a product.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.product_id Product ID.
 * @apiSuccess {Number} result.tag_id Tag ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can remove tags from products.
 * @apiError (400 BadRequest) CouldNotRemove Could not remove tag from product.
 * @apiError (500 ServerError) InternalError Error removing tag from product.
 */
productsRouter
  .route("/:productId/tags/:tagId")
  .delete(authenticateToken, deleteProductTag);

/**
 * @api {get} /products/category/:categoryId Get products by category
 * @apiName GetProductsByCategory
 * @apiGroup Products
 *
 * @apiParam {Number} categoryId Category ID.
 *
 * @apiSuccess {String} message Products found.
 * @apiSuccess {Object[]} products List of products in this category.
 *
 * @apiError (404 NotFound) ProductsNotFound Products not found.
 * @apiError (500 ServerError) InternalError Error getting products.
 */
productsRouter.route("/category/:categoryId").get(getAllProductsByCategory);

/**
 * @api {get} /products/tags/:tagId Get products by tag
 * @apiName GetProductsByTag
 * @apiGroup Products
 *
 * @apiParam {Number} tagId Tag ID.
 *
 * @apiSuccess {String} message Products found.
 * @apiSuccess {Object[]} products List of products with this tag.
 *
 * @apiError (404 NotFound) ProductsNotFound Products not found.
 * @apiError (500 ServerError) InternalError Error getting products.
 */
productsRouter.route("/tags/:tagId").get(getProductsByTagId);

export default productsRouter;

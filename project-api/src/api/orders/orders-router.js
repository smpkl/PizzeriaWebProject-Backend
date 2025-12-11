import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { body } from "express-validator";
import { validationErrors } from "../../middlewares/error-handler.js";

import {
  getAllOrders,
  getOrderById,
  getAllUsersOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  postOrderProduct,
  deleteOrderProduct,
  getOrderProducts,
} from "./orders-controller.js";

const orderRouter = express.Router();

const orderPostValidationChain = () => {
  return [
    body("userId").optional().trim().isInt().withMessage("Order user ID name must be an integer."),
    body("status").trim().notEmpty().withMessage("Order status cannot be empty.")
      .isLength({ min: 1, max: 50 }).withMessage("Order status must be between 1 to 50 characters long."),
    body("orderType").trim().notEmpty().withMessage("Order type cannot be empty.")
      .isLength({ min: 1, max: 50 }).withMessage("Order type must be between 1 to 50 characters long."),
    body("timeOption").trim().notEmpty().withMessage("Order time option cannot be empty.")
      .isLength({ min: 1, max: 50 }).withMessage("Order time option must be between 1 to 50 characters long."),
    body("dateTime").notEmpty().withMessage("Order's ready time cannot be empty.")
      .isISO8601().withMessage("Order's ready time must be a valid date."),
    body("deliveryAddress").trim().notEmpty().withMessage("User address cannot be empty.")
      .isLength({ min: 10, max: 400 }).withMessage("User address must be atleast 10 characters long.")
      .matches(/^[0-9a-zA-ZäöåÄÖÅ .,'/:;-]+$/).withMessage("User address contains invalid characters."),
    body("pizzeriaAddress").trim().notEmpty().withMessage("Pizzeria address cannot be empty.")
      .isLength({ min: 10, max: 400 }).withMessage("Pizzeria address must be atleast 10 characters long.")
      .matches(/^[0-9a-zA-ZäöåÄÖÅ .,'/:;-]+$/).withMessage("Pizzeria address contains invalid characters."),
    body("customerName").trim().notEmpty().withMessage("Customer name cannot be empty.")
      .isAlpha("fi-FI", { ignore: " -'" }).withMessage("Customer name can only contain letters"),
    body("customerPhone").trim().notEmpty().withMessage("Customer phonenumber cannot be empty.")
      .isLength({ min: 8, max: 50 }).withMessage("Customer phonenumber must be between 8 to 50 characters long."),
    body("customerEmail").trim().notEmpty().withMessage("Customer email cannot be empty.")
      .isEmail().withMessage("Customer email must be a valid email address."),
    body("price").trim().notEmpty().withMessage("Order price cannot be empty.")
      .isFloat().withMessage("Order price must be valid (decimal) number."),
  ];
};

const orderPutValidationChain = () => {
  return [
    body("userId").optional().isInt(),
    body("status").optional().isLength({ min: 1, max: 50 }),
    body("orderType").optional().isLength({ min: 1, max: 50 }),
    body("timeOption").optional().isLength({ min: 1, max: 50 }),
    body("dateTime").optional().isISO8601(),
    body("deliveryAddress").optional().isLength({ min: 10, max: 400 }),
    body("pizzeriaAddress").optional().isLength({ min: 10, max: 400 }),
    body("customerName").optional().isAlpha("fi-FI", { ignore: " -'" }),
    body("customerPhone").optional().isLength({ min: 8, max: 50 }),
    body("customerEmail").optional().isEmail(),
    body("price").optional().isFloat(),
  ];
};

/**
 * @api {get} /orders Get all orders
 * @apiName GetAllOrders
 * @apiGroup Orders
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Orders found.
 * @apiSuccess {Object[]} orders List of all orders.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can list all orders.
 * @apiError (500 ServerError) Error getting orders.
 */
orderRouter
  .route("/")
  .get(authenticateToken, getAllOrders)
  /**
   * @api {post} /orders Create a new order
   * @apiName AddOrder
   * @apiGroup Orders
   *
   * @apiBody {Number} [userId] User ID (guest orders allowed).
   * @apiBody {String} status Order status.
   * @apiBody {String} orderType Pickup or delivery.
   * @apiBody {String} timeOption ASAP or scheduled.
   * @apiBody {String} dateTime Scheduled date/time.
   * @apiBody {String} deliveryAddress User delivery address.
   * @apiBody {String} pizzeriaAddress Pizzeria address.
   * @apiBody {String} customerName Customer full name.
   * @apiBody {String} customerEmail Customer email.
   * @apiBody {String} customerPhone Customer phone.
   * @apiBody {String} [details] Optional extra details.
   * @apiBody {Number} price Final order price.
   *
   * @apiSuccess (201 Created) {String} message New order added successfully.
   * @apiSuccess {Number} order_id Newly created order ID.
   *
   * @apiError (400 ValidationError) Invalid or missing fields.
   * @apiError (400 BadRequest) Check your request.
   * @apiError (500 ServerError) Error adding new order.
   */
  .post(orderPostValidationChain(), validationErrors, addOrder);


/**
 * @api {get} /orders/:id Get order by ID
 * @apiName GetOrderById
 * @apiGroup Orders
 *
 * @apiParam {Number} id Order ID.
 *
 * @apiSuccess {String} message Order found.
 * @apiSuccess {Object} order Order data.
 *
 * @apiError (404 NotFound) Order not found.
 * @apiError (500 ServerError) Error getting order.
 */

/**
 * @api {put} /orders/:id Update order
 * @apiName UpdateOrder
 * @apiGroup Orders
 *
 * @apiParam {Number} id Order ID.
 *
 * @apiBody {Object} Any order fields to update.
 *
 * @apiSuccess {String} message Update was successful.
 *
 * @apiError (404 NotFound) Order not found.
 * @apiError (400 BadRequest) Check your request.
 * @apiError (500 ServerError) Error updating order.
 */

/**
 * @api {delete} /orders/:id Delete order
 * @apiName DeleteOrder
 * @apiGroup Orders
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiParam {Number} id Order ID.
 *
 * @apiSuccess {String} message Order deleted.
 *
 * @apiError (401 Unauthorized) Missing token.
 * @apiError (403 Forbidden) Only admins can delete orders.
 * @apiError (400 BadRequest) Could not delete order.
 * @apiError (500 ServerError) Error deleting order.
 */
orderRouter
  .route("/:id")
  .get(getOrderById)
  .put(orderPutValidationChain(), validationErrors, updateOrder)
  .delete(authenticateToken, deleteOrder);

/**
 * @api {get} /orders/user/:id Get all orders of a user
 * @apiName GetUserOrders
 * @apiGroup Orders
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiParam {Number} id User ID.
 *
 * @apiSuccess {String} message User orders found.
 * @apiSuccess {Object[]} orders Orders belonging to this user.
 *
 * @apiError (401 Unauthorized) Missing token.
 * @apiError (403 Forbidden) Only admin or the user can access their orders.
 * @apiError (404 NotFound) User orders not found.
 * @apiError (500 ServerError) Error getting user orders.
 */
orderRouter.route("/user/:id").get(authenticateToken, getAllUsersOrders);

/**
 * @api {get} /orders/:orderId/products Get products in an order
 * @apiName GetOrderProducts
 * @apiGroup Orders
 *
 * @apiParam {Number} orderId Order ID.
 *
 * @apiSuccess {String} message Order products found.
 * @apiSuccess {Object[]} products List of products with quantity.
 *
 * @apiError (404 NotFound) Order products not found.
 * @apiError (500 ServerError) Error getting order products.
 */
orderRouter.route("/:orderId/products").get(getOrderProducts);

/**
 * @api {post} /orders/:orderId/products Add product to order
 * @apiName AddProductToOrder
 * @apiGroup Orders
 *
 * @apiParam {Number} orderId Order ID.
 * @apiBody {Number} product_id Product ID.
 * @apiBody {Number} quantity Quantity.
 *
 * @apiSuccess {String} message New product added to an order.
 *
 * @apiError (400 BadRequest) Could not add product.
 * @apiError (500 ServerError) Error adding product to an order.
 */
orderRouter.route("/:orderId/products").post(postOrderProduct);

/**
 * @api {delete} /orders/:orderId/products/:productId Remove product from order
 * @apiName DeleteProductFromOrder
 * @apiGroup Orders
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiParam {Number} orderId Order ID.
 * @apiParam {Number} productId Product ID.
 *
 * @apiSuccess {String} message Product removed from an order.
 *
 * @apiError (401 Unauthorized) Missing token.
 * @apiError (403 Forbidden) Only admins can remove products from orders.
 * @apiError (400 BadRequest) Could not remove product.
 * @apiError (500 ServerError) Error removing product.
 */
orderRouter
  .route("/:orderId/products/:productId")
  .delete(authenticateToken, deleteOrderProduct);

export default orderRouter;

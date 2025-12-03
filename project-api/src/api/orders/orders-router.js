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
    body("userId")
      .optional()
      .trim()
      .isInt()
      .withMessage("Order user ID name must be an integer."),
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Order status cannot be empty.")
      .bail()
      .isLength({ min: 1, max: 50 })
      .withMessage("Order status must be between 1 to 50 characters long."),
    body("orderType")
      .trim()
      .notEmpty()
      .withMessage("Order type cannot be empty.")
      .bail()
      .isLength({ min: 1, max: 50 })
      .withMessage("Order type must be between 1 to 50 characters long."),
    body("timeOption")
      .trim()
      .notEmpty()
      .withMessage("Order time option cannot be empty.")
      .bail()
      .isLength({ min: 1, max: 50 })
      .withMessage(
        "Order time option must be between 1 to 50 characters long."
      ),
    body("dateTime")
      .notEmpty()
      .withMessage("Order's ready time cannot be empty.")
      .bail()
      .isISO8601()
      .withMessage("Order's ready time must be a valid date."),
    body("deliveryAddress")
      .trim()
      .notEmpty()
      .withMessage("Delivery address cannot be empty.")
      .bail()
      .isLength({ min: 10, max: 400 })
      .withMessage("Delivery address must be atleast 10 characters long.")
      .bail()
      .isAlphanumeric("en-US", { ignore: " .,':;" })
      .withMessage(
        "Delivery address cannot contain special characters (!, ?, # etc.)."
      ),
    body("pizzeriaAddress")
      .trim()
      .notEmpty()
      .withMessage("Pizzeria address cannot be empty.")
      .bail()
      .isLength({ min: 10, max: 400 })
      .withMessage("Pizzeria address must be atleast 10 characters long.")
      .bail()
      .isAlphanumeric("en-US", { ignore: " .,':;" })
      .withMessage(
        "Pizzeria address cannot contain special characters (!, ?, # etc.)."
      ),
    body("customerName")
      .trim()
      .notEmpty()
      .withMessage("Customer name cannot be empty.")
      .bail()
      .isAlpha("fi-FI", { ignore: " -'" })
      .withMessage("Customer name can only contain letters"),
    body("customerPhone")
      .trim()
      .notEmpty()
      .withMessage("Customer phonenumber cannot be empty.")
      .bail()
      .isLength({ min: 8, max: 50 })
      .withMessage(
        "Customer phonenumber must be between 8 to 50 characters long."
      ),
    body("customerEmail")
      .trim()
      .notEmpty()
      .withMessage("Customer email cannot be empty.")
      .bail()
      .isEmail()
      .withMessage("Customer email must be a valid email address."),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Order price cannot be empty.")
      .bail()
      .isFloat()
      .withMessage("Order price must be valid (decimal) number."),
  ];
};

const orderPutValidationChain = () => {
  return [
    body("userId")
      .optional()
      .trim()
      .isInt()
      .withMessage("Order user ID name must be an integer."),
    body("status")
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Order status must be between 1 to 50 characters long."),
    body("orderType")
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Order type must be between 1 to 50 characters long."),
    body("timeOption")
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage(
        "Order time option must be between 1 to 50 characters long."
      ),
    body("dateTime")
      .optional()
      .trim()
      .isISO8601()
      .withMessage("Order's ready time must be a valid date."),
    body("deliveryAddress")
      .optional()
      .trim()
      .isLength({ min: 10, max: 400 })
      .withMessage("Delivery address must be atleast 10 characters long.")
      .bail()
      .isAlphanumeric("en-US", { ignore: " .,':;" })
      .withMessage(
        "Delivery address cannot contain special characters (!, ?, # etc.)."
      ),
    body("pizzeriaAddress")
      .optional()
      .trim()
      .isLength({ min: 10, max: 400 })
      .withMessage("Pizzeria address must be atleast 10 characters long.")
      .bail()
      .isAlphanumeric("en-US", { ignore: " .,':;" })
      .withMessage(
        "Pizzeria address cannot contain special characters (!, ?, # etc.)."
      ),
    body("customerName")
      .optional()
      .trim()
      .isAlpha("fi-FI", { ignore: " -'" })
      .withMessage("Customer name can only contain letters"),
    body("customerPhone")
      .optional()
      .trim()
      .isLength({ min: 8, max: 50 })
      .withMessage(
        "Customer phonenumber must be between 8 to 50 characters long."
      ),
    body("customerEmail")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Customer email must be a valid email address."),
    body("price")
      .optional()
      .trim()
      .isFloat()
      .withMessage("Order price must be valid (decimal) number."),
  ];
};

// Routes related to announcements:
// Mihin tänne täytyy laittaa tota authenticateTokenia?
orderRouter
  .route("/")
  .get(authenticateToken, getAllOrders)
  .post(orderPostValidationChain(), validationErrors, addOrder);

orderRouter
  .route("/:id")
  .get(getOrderById)
  .put(orderPutValidationChain(), validationErrors, updateOrder)
  .delete(authenticateToken, deleteOrder);

// Products in the order (parameter=order id)
orderRouter
  .route("/:orderId/products")
  .get(getOrderProducts)
  .post(authenticateToken, postOrderProduct);

orderRouter
  .route("/:orderId/products/:productId")
  .delete(authenticateToken, deleteOrderProduct); // Delete product from an order (parameter1= order id, parameter2=product id)

orderRouter.route("/user/:id").get(authenticateToken, getAllUsersOrders); // Get order by user id

//Halutaanko tehdä iha omat status haut, vai hakee kaikki ja mappaa/filteröidä sit oikeesee statuksee kuuluvat?
//orderRouter.route("/status/:status").get(getOrdersByStatus); // Get all orders with a specific status (ostoskori, uusi/saapunut, käsittelyssä, käsitelty, arkistoitu)

export default orderRouter;

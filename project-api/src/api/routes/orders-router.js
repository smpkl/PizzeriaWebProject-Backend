import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  findAllOrders,
  findOrderById,
  getOrdersByTagId,
  postOrder,
  putOrder,
  deleteOrder,
} from "../controllers/orders-controller.js";

const orderRouter = express.Router();

// Routes related to orders:
orderRouter.route("/").get(findAllOrders);
orderRouter.route("/:id").get(findOrderById);
orderRouter.route("/orders/:orderId/tags").get(getOrdersByTagId);
orderRouter.route("/").get(findAllOrders).post(postOrder);
orderRouter.route("/:id").put(putOrder);
orderRouter.route("/:id").delete(deleteOrder);

orderRouter.route("/user/:id").get(getOrdersById); // Get order by user id

orderRouter.route("/status/:status").get(getOrdersByStatus); // Get all orders with a specific status (ostoskori, uusi/saapunut, käsittelyssä, käsitelty, arkistoitu)

export default orderRouter;

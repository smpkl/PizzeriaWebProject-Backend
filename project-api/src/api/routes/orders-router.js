import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
} from "../controllers/orders-controller.js";

const orderRouter = express.Router();

// Routes related to announcements:
orderRouter.route("/").get(getAllOrders);
orderRouter.route("/:id").get(getOrderById);

orderRouter.route("/user/:id").get(getOrderByUserId); // Get order by user id

orderRouter.route("/status/:status").get(getOrdersByStatus); // Get all orders with a specific status (ostoskori, uusi/saapunut, käsittelyssä, käsitelty, arkistoitu)

export default orderRouter;

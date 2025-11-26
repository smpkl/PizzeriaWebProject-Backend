import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllOrders,
  getOrderById,
  getAllUsersOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "./orders-controller.js";

const orderRouter = express.Router();

// Routes related to announcements:
// Mihin tänne täytyy laittaa tota authenticateTokenia?
orderRouter.route("/").get(authenticateToken, getAllOrders).post(addOrder);
orderRouter
  .route("/:id")
  .get(getOrderById)
  .put(updateOrder)
  .delete(authenticateToken, deleteOrder);

orderRouter.route("/user/:id").get(authenticateToken, getAllUsersOrders); // Get order by user id

//Halutaanko tehdä iha omat status haut, vai hakee kaikki ja mappaa/filteröidä sit oikeesee statuksee kuuluvat?
//orderRouter.route("/status/:status").get(getOrdersByStatus); // Get all orders with a specific status (ostoskori, uusi/saapunut, käsittelyssä, käsitelty, arkistoitu)

export default orderRouter;

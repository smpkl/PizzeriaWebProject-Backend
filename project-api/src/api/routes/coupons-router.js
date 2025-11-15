import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
} from "../controllers/coupons-controller.js";

const couponsRouter = express.Router();

// Routes related to announcements:
couponsRouter.route("/").get(getAllCoupons);
couponsRouter.route("/:id").get(getCouponById);

export default couponsRouter;

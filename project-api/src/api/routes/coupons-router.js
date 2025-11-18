import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllCoupons,
  getCouponById,
  addCoupon,
  updateCoupon,
} from "../controllers/coupons-controller.js";

const couponsRouter = express.Router();

// Routes related to announcements:
couponsRouter.route("/").get(getAllCoupons).post(addCoupon);
couponsRouter.route("/:id").get(getCouponById).put(updateCoupon);

export default couponsRouter;

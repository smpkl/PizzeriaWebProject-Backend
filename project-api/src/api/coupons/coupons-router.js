import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllCoupons,
  getCouponById,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "./coupons-controller.js";

const couponsRouter = express.Router();

// Routes related to announcements:
couponsRouter.route("/").get(getAllCoupons).post(addCoupon);
couponsRouter
  .route("/:id")
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

export default couponsRouter;

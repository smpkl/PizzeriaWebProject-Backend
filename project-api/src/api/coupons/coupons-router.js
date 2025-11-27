import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { body } from "express-validator";
import { validationErrors } from "../../middlewares/error-handler.js";

import {
  getAllCoupons,
  getCouponById,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "./coupons-controller.js";

const couponsRouter = express.Router();

const couponValidationChain = () => {
  return [
    body("coupon")
      .trim()
      .notEmpty()
      .withMessage("Coupon cannot be empty.")
      .bail()
      .isLength({ min: 2, max: 50 })
      .withMessage("Coupon must be between 2 to 50 characters long."),
    body("discount_percentage")
      .trim()
      .notEmpty()
      .withMessage("Coupon discount percentage cannot be empty.")
      .bail()
      .isFloat()
      .withMessage(
        "Coupon discount percentage must be a valid (decimal) number."
      ),
    body("start_date")
      .notEmpty()
      .withMessage("Coupon start date cannot be empty.")
      .bail()
      .isISO8601() // datetime
      .withMessage("Coupon start date must be a valid date."),
    body("end_date")
      .notEmpty()
      .withMessage("Coupon end date cannot be empty.")
      .bail()
      .isISO8601() // datetime
      .withMessage("Coupon end date must be a valid date."),
  ];
};

// Routes related to announcements:
// Täytyykö gorAllCoupons laittaa authenticateToken? Voiko kuka tahansa hakea kaikki kupongit? Väärinkäyttömahdollisuus?
// Asiakkaan syöttämä kuponki pitää kuitenkin jotenkin tarkastaa, vaikka käyttäjä ei ole kirjautuneena.
couponsRouter
  .route("/")
  .get(getAllCoupons)
  .post(
    authenticateToken,
    couponValidationChain(),
    validationErrors,
    addCoupon
  );

couponsRouter
  .route("/:id")
  .get(getCouponById) // Tämä myös?
  .put(
    authenticateToken,
    couponValidationChain(),
    validationErrors,
    updateCoupon
  )
  .delete(authenticateToken, deleteCoupon);

export default couponsRouter;

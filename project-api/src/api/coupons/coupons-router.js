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
      .isISO8601()
      .withMessage("Coupon start date must be a valid date."),
    body("end_date")
      .notEmpty()
      .withMessage("Coupon end date cannot be empty.")
      .bail()
      .isISO8601()
      .withMessage("Coupon end date must be a valid date."),
  ];
};

const couponPutValidationChain = () => {
  return [
    body("coupon")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Coupon must be between 2 to 50 characters long."),
    body("discount_percentage")
      .optional()
      .trim()
      .isFloat()
      .withMessage(
        "Coupon discount percentage must be a valid (decimal) number."
      ),
    body("start_date")
      .optional()
      .trim()
      .isISO8601()
      .withMessage("Coupon start date must be a valid date."),
    body("end_date")
      .optional()
      .trim()
      .isISO8601()
      .withMessage("Coupon end date must be a valid date."),
  ];
};

/**
 * @api {get} /coupons Get all coupons
 * @apiName GetAllCoupons
 * @apiGroup Coupons
 *
 * @apiSuccess {String} message Coupons found.
 * @apiSuccess {Object[]} coupons List of coupons.
 * @apiSuccess {Number} coupons.id Coupon ID.
 * @apiSuccess {String} coupons.coupon Coupon code.
 * @apiSuccess {Number} coupons.discount_percentage Discount percentage.
 * @apiSuccess {String} coupons.start_date Start date (ISO8601).
 * @apiSuccess {String} coupons.end_date End date (ISO8601).
 *
 * @apiError (500 ServerError) Error getting coupons.
 */
couponsRouter
  .route("/")
  .get(getAllCoupons)
  /**
   * @api {post} /coupons Create a new coupon
   * @apiName AddCoupon
   * @apiGroup Coupons
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiBody {String{2..50}} coupon Coupon code.
   * @apiBody {Number} discount_percentage Discount percentage (decimal allowed).
   * @apiBody {String} start_date Start date (ISO8601).
   * @apiBody {String} end_date End date (ISO8601).
   *
   * @apiSuccess (201 Created) {String} message New coupon added successfully.
   * @apiSuccess {Object} newCouponAdded Result object.
   * @apiSuccess {Number} newCouponAdded.couponId New coupon ID.
   *
   * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
   * @apiError (403 Forbidden) Forbidden Only admins can create coupons.
   * @apiError (400 BadRequest) Check your request.
   * @apiError (500 ServerError) Error adding new coupon.
   */
  .post(
    authenticateToken,
    couponValidationChain(),
    validationErrors,
    addCoupon
  );

/**
 * @api {get} /coupons/:id Get coupon by ID
 * @apiName GetCouponById
 * @apiGroup Coupons
 *
 * @apiParam {Number} id Coupon ID.
 *
 * @apiSuccess {String} message Coupon found.
 * @apiSuccess {Object} coupon Coupon object.
 * @apiSuccess {Number} coupon.id Coupon ID.
 * @apiSuccess {String} coupon.coupon Coupon code.
 * @apiSuccess {Number} coupon.discount_percentage Discount percentage.
 * @apiSuccess {String} coupon.start_date Start date (ISO8601).
 * @apiSuccess {String} coupon.end_date End date (ISO8601).
 *
 * @apiError (404 NotFound) Coupon not found.
 * @apiError (500 ServerError) Error getting coupon.
 */

/**
 * @api {put} /coupons/:id Update coupon
 * @apiName UpdateCoupon
 * @apiGroup Coupons
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Coupon ID.
 *
 * @apiBody {String{2..50}} [coupon] Coupon code.
 * @apiBody {Number} [discount_percentage] Discount percentage.
 * @apiBody {String} [start_date] Start date (ISO8601).
 * @apiBody {String} [end_date] End date (ISO8601).
 *
 * @apiSuccess {String} message Coupon update was successfull.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can update coupons.
 * @apiError (400 BadRequest) Check your request.
 * @apiError (500 ServerError) Error updating a coupon.
 */

/**
 * @api {delete} /coupons/:id Delete coupon
 * @apiName DeleteCoupon
 * @apiGroup Coupons
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Coupon ID.
 *
 * @apiSuccess {String} message Coupon deleted.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.coupon_Id Deleted coupon ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can delete coupons.
 * @apiError (400 BadRequest) Could not delete coupon.
 * @apiError (500 ServerError) Error deleting coupon.
 */
couponsRouter
  .route("/:id")
  .get(getCouponById)
  .put(
    authenticateToken,
    couponPutValidationChain(),
    validationErrors,
    updateCoupon
  )
  .delete(authenticateToken, deleteCoupon);

export default couponsRouter;

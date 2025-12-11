import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { body } from "express-validator";
import { validationErrors } from "../../middlewares/error-handler.js";
import {
  getAllFeedbacks,
  getFeedbackById,
  getAllUsersFeedbacks,
  addFeedback,
  updateFeedback,
  deleteFeedback,
} from "./feedbacks-controller.js";

const feedbacksRouter = express.Router();

const feedbackValidationChain = () => {
  return [
    body("user_id")
      .optional()
      .trim()
      .isInt()
      .withMessage("Feedback user ID must be an integer."),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email must be given to send feedback.")
      .bail()
      .isEmail()
      .withMessage("Email must be valid."),
    body("feedback")
      .trim()
      .notEmpty()
      .withMessage("Cannot send feedback without content.")
      .bail()
      .isLength({ min: 2, max: 800 })
      .withMessage("Feedback text must be between 2 to 800 characters long."),
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Feedback status cannot be empty")
      .bail()
      .isLength({ min: 1, max: 80 })
      .withMessage("Feedback status must be between 1 to 80 characters long."),
    body("received")
      .notEmpty()
      .withMessage("Feedback's arrival date cannot be empty.")
      .bail()
      .isISO8601()
      .withMessage("Feedback's arrival date must be a valid date."),
    body("end_date")
      .optional()
      .isISO8601()
      .withMessage("Feedback's handling date must be a valid date."),
  ];
};

const feedbackPutValidationChain = () => {
  return [
    body("user_id")
      .optional()
      .trim()
      .isInt()
      .withMessage("Feedback user ID must be an integer."),
    body("email").optional().trim().isEmail().withMessage("Email must be valid."),
    body("feedback")
      .optional()
      .trim()
      .isLength({ min: 2, max: 800 })
      .withMessage("Feedback text must be between 2 to 800 characters long."),
    body("status")
      .optional()
      .trim()
      .isLength({ min: 1, max: 80 })
      .withMessage("Feedback status must be between 1 to 80 characters long."),
    body("received")
      .optional()
      .trim()
      .isISO8601()
      .withMessage("Feedback's arrival date must be a valid date."),
    body("handled")
      .optional()
      .isISO8601()
      .withMessage("Feedback's handling date must be a valid date."),
  ];
};

/**
 * @api {get} /feedbacks Get all feedbacks
 * @apiName GetAllFeedbacks
 * @apiGroup Feedbacks
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Feedbacks found.
 * @apiSuccess {Object[]} feedbacks List of feedbacks.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (500 ServerError) Error getting feedbacks.
 */
feedbacksRouter
  .route("/")
  .get(authenticateToken, getAllFeedbacks)
  /**
   * @api {post} /feedbacks Create new feedback
   * @apiName AddFeedback
   * @apiGroup Feedbacks
   *
   * @apiBody {Number} [user_id] User ID (optional, guest feedback allowed).
   * @apiBody {String} email Email of the sender.
   * @apiBody {String{2..800}} feedback Feedback text.
   * @apiBody {String{1..80}} status Feedback status.
   * @apiBody {String} received Date when feedback was received (ISO8601).
   * @apiBody {String} [handled] Date when feedback was handled (ISO8601).
   *
   * @apiSuccess (201 Created) {String} message New feedback added successfully.
   *
   * @apiError (400 BadRequest) Check your request.
   * @apiError (500 ServerError) Error adding new feedback.
   */
  .post(feedbackValidationChain(), validationErrors, addFeedback);

/**
 * @api {get} /feedbacks/user/:id Get all feedbacks by user
 * @apiName GetAllUsersFeedbacks
 * @apiGroup Feedbacks
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User ID.
 *
 * @apiSuccess {String} message User feedback found.
 * @apiSuccess {Object[]} feedbacks List of feedbacks by this user.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admin or the user can view these feedbacks.
 * @apiError (404 NotFound) User feedbacks not found.
 * @apiError (500 ServerError) Error getting user feedbacks.
 */
feedbacksRouter
  .route("/user/:id")
  .get(authenticateToken, getAllUsersFeedbacks);

/**
 * @api {get} /feedbacks/:id Get feedback by ID
 * @apiName GetFeedbackById
 * @apiGroup Feedbacks
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Feedback ID.
 *
 * @apiSuccess {String} message Feedback found.
 * @apiSuccess {Object} feedback Feedback object.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (404 NotFound) Feedback not found.
 * @apiError (500 ServerError) Error getting feedback.
 */

/**
 * @api {put} /feedbacks/:id Update feedback
 * @apiName UpdateFeedback
 * @apiGroup Feedbacks
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Feedback ID.
 *
 * @apiBody {Number} [user_id] User ID.
 * @apiBody {String} [email] Email.
 * @apiBody {String{2..800}} [feedback] Feedback text.
 * @apiBody {String{1..80}} [status] Feedback status.
 * @apiBody {String} [received] Arrival date (ISO8601).
 * @apiBody {String} [handled] Handling date (ISO8601).
 *
 * @apiSuccess {String} message Update was successfull.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can update feedbacks.
 * @apiError (400 BadRequest) Check your request.
 * @apiError (500 ServerError) Error updating feedback.
 */

/**
 * @api {delete} /feedbacks/:id Delete feedback
 * @apiName DeleteFeedback
 * @apiGroup Feedbacks
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Feedback ID.
 *
 * @apiSuccess {String} message Feedback deleted.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can delete feedbacks.
 * @apiError (400 BadRequest) Could not delete feedback.
 * @apiError (500 ServerError) Error deleting feedback.
 */
feedbacksRouter
  .route("/:id")
  .get(authenticateToken, getFeedbackById)
  .put(
    authenticateToken,
    feedbackPutValidationChain(),
    validationErrors,
    updateFeedback
  )
  .delete(authenticateToken, deleteFeedback);

export default feedbacksRouter;

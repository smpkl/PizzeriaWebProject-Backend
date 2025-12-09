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
      .isISO8601() // datetime
      .withMessage("Feedback's arrival date must be a valid date."),
    body("end_date")
      .optional()
      .isISO8601() // datetime
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
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Email must be valid."),
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
      .isISO8601() // datetime
      .withMessage("Feedback's arrival date must be a valid date."),
    body("handled")
      .optional()
      .isISO8601() // datetime
      .withMessage("Feedback's handling date must be a valid date."),
  ];
};

// Routes related to announcements:
feedbacksRouter
  .route("/")
  .get(authenticateToken, getAllFeedbacks)
  .post(feedbackValidationChain(), validationErrors, addFeedback);

feedbacksRouter
  .route("/:id")
  .get(authenticateToken, getFeedbackById)
  .get(authenticateToken, getAllUsersFeedbacks)
  .put(
    authenticateToken,
    feedbackPutValidationChain(),
    validationErrors,
    updateFeedback
  )
  .delete(authenticateToken, deleteFeedback);

//sama kun orders, onkohan tarpeellinen erillinen kutsu vai filteröidää/mapataa backissa se.
//feedbacksRouter.route("/status/:status").get(getFeedbacksByStatus); // Get all feedbacks that have a certain status (uusi, käsitelty, arkistoitu)

export default feedbacksRouter;

import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllFeedbacks,
  getFeedbackById,
  getAllUsersFeedbacks,
  addFeedback,
  updateFeedback,
  deleteFeedback,
} from "./feedbacks-controller.js";

const feedbacksRouter = express.Router();

// Routes related to announcements:
feedbacksRouter
  .route("/")
  .get(authenticateToken, getAllFeedbacks)
  .post(addFeedback);

feedbacksRouter
  .route("/:id")
  .get(authenticateToken, getFeedbackById)
  .get(authenticateToken, getAllUsersFeedbacks)
  .put(authenticateToken, updateFeedback)
  .delete(authenticateToken, deleteFeedback);

//sama kun orders, onkohan tarpeellinen erillinen kutsu vai filteröidää/mapataa backissa se.
//feedbacksRouter.route("/status/:status").get(getFeedbacksByStatus); // Get all feedbacks that have a certain status (uusi, käsitelty, arkistoitu)

export default feedbacksRouter;

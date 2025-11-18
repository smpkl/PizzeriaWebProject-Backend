import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllFeedbacks,
  getFeedbackById,
  getAllUsersFeedbacks,
  getFeedbacksByStatus,
  addFeedback,
  updateFeedback,
} from "../controllers/feedbacks-controller.js";

const feedbacksRouter = express.Router();

// Routes related to announcements:
feedbacksRouter.route("/").get(getAllFeedbacks).post(addFeedback);
feedbacksRouter.route("/:id").get(getFeedbackById).get(getAllUsersFeedbacks).put(updateFeedback);


//sama kun orders, onkohan tarpeellinen erillinen kutsu vai filteröidää/mapataa backissa se.
feedbacksRouter.route("/status/:status").get(getFeedbacksByStatus); // Get all feedbacks that have a certain status (uusi, käsitelty, arkistoitu)

export default feedbacksRouter;

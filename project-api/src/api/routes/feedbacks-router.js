import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllFeedbacks,
  getFeedbackById,
  getFeedbacksByStatus,
} from "../controllers/feedbacks-controller.js";

const feedbacksRouter = express.Router();

// Routes related to announcements:
feedbacksRouter.route("/").get(getAllFeedbacks);
feedbacksRouter.route("/:id").get(getFeedbackById);

feedbacksRouter.route("/status/:status").get(getFeedbacksByStatus); // Get all feedbacks that have a certain status (uusi, käsitelty, arkistoitu)

export default feedbacksRouter;

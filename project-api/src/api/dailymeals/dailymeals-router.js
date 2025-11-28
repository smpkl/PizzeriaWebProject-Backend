import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllDailymeals,
  getDailymealByDay,
  putDailymeal,
} from "./dailymeals-controller.js";

const dailymealsRouter = express.Router();

// Routes related to categories:
dailymealsRouter.route("/").get(getAllDailymeals);

dailymealsRouter
  .route("/:day")
  .get(getDailymealByDay)
  .put(authenticateToken, putDailymeal);

export default dailymealsRouter;

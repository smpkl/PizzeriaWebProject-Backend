import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllDailymeals,
  getDailymealByDay,
  putDailymeal,
} from "./dailymeals-controller.js";

const dailymealsRouter = express.Router();

/**
 * @api {get} /dailymeals Get all daily meals
 * @apiName GetAllDailymeals
 * @apiGroup Dailymeals
 *
 * @apiSuccess {String} message Daily meals found.
 * @apiSuccess {Object[]} dailymeals List of daily meals.
 * @apiSuccess {String} dailymeals.day Weekday key (e.g. "monday").
 * @apiSuccess {Number} dailymeals.meal_id Meal ID.
 * @apiSuccess {String} dailymeals.meal_name Meal name.
 * @apiSuccess {Number} dailymeals.meal_price Meal price.
 * @apiSuccess {String} [dailymeals.meal_filename] Meal image filename.
 *
 * @apiError (500 ServerError) Error getting daily meals.
 */
dailymealsRouter.route("/").get(getAllDailymeals);

/**
 * @api {get} /dailymeals/:day Get daily meal by day
 * @apiName GetDailymealByDay
 * @apiGroup Dailymeals
 *
 * @apiParam {String} day Weekday key (e.g. "monday").
 *
 * @apiSuccess {String} message Daily meal found.
 * @apiSuccess {Object} dailymeal Daily meal object.
 * @apiSuccess {Number} dailymeal.id Meal ID.
 * @apiSuccess {String} dailymeal.name Meal name.
 * @apiSuccess {Number} dailymeal.price Meal price.
 * @apiSuccess {String} [dailymeal.filename] Meal image filename.
 *
 * @apiError (404 NotFound) Dailymeal not found.
 * @apiError (500 ServerError) Error getting daily meal.
 */

/**
 * @api {put} /dailymeals/:day Update daily meal for a day
 * @apiName PutDailymeal
 * @apiGroup Dailymeals
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {String} day Weekday key (e.g. "monday").
 *
 * @apiBody {Number} meal_id New meal ID for this day.
 *
 * @apiSuccess {String} message Daily meal updated.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {String} result.day Updated day.
 * @apiSuccess {Number} result.meal_id Updated meal ID.
 *
 * @apiError (401 Unauthorized) Unauthorized.
 * @apiError (403 Forbidden) Forbidden (only admins can update daily meals).
 * @apiError (400 BadRequest) Could not update daily meal.
 * @apiError (500 ServerError) Error updating daily meal.
 */
dailymealsRouter
  .route("/:day")
  .get(getDailymealByDay)
  .put(authenticateToken, putDailymeal);

export default dailymealsRouter;

import express from "express";

import { getAllLocations, getLocationById } from "./locations-controller.js";

const locationsRouter = express.Router();

/**
 * @api {get} /locations Get all locations
 * @apiName GetAllLocations
 * @apiGroup Locations
 *
 * @apiSuccess {String} message Locations found.
 * @apiSuccess {Object[]} locations List of locations.
 *
 * @apiError (500 ServerError) Error getting locations.
 */
locationsRouter.route("/").get(getAllLocations);

/**
 * @api {get} /locations/:id Get location by ID
 * @apiName GetLocationById
 * @apiGroup Locations
 *
 * @apiParam {Number} id Location ID.
 *
 * @apiSuccess {String} message Location found.
 * @apiSuccess {Object} location Location data.
 *
 * @apiError (404 NotFound) Location not found.
 * @apiError (500 ServerError) Error getting location.
 */
locationsRouter.route("/:id").get(getLocationById);

export default locationsRouter;

import express from "express";

import { getAllLocations, getLocationById } from "./locations-controller.js";

const locationsRouter = express.Router();

locationsRouter.route("/").get(getAllLocations);

locationsRouter.route("/:id").get(getLocationById);

export default locationsRouter;

import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllAnnouncements,
  getAnnouncementById,
} from "../controllers/announcements-controller.js";

const announcRouter = express.Router();

// Routes related to announcements:
announcRouter.route("/").get(getAllAnnouncements);
announcRouter.route("/:id").get(getAnnouncementById);

export default announcRouter;

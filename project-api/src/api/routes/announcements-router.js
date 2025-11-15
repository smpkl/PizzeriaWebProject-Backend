import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllAnnouncements,
  getAnnouncementById,
} from "../controllers/announcements-controller.js";

const announcRouter = express.Router();

// Routes related to announcements:
announcRouter.route("/announc").get(getAllAnnouncements);
announcRouter.route("/announc/:id").get(getAnnouncementById);

export default announcRouter;

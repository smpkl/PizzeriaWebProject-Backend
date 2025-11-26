import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllAnnouncements,
  getAnnouncementById,
  postAnnouncement,
  putAnnouncement,
  deleteAnnouncement,
} from "./announcements-controller.js";

const announcRouter = express.Router();

// Routes related to announcements:
announcRouter.route("/").get(authenticateToken, getAllAnnouncements);
announcRouter.route("/:id").get(authenticateToken, getAnnouncementById);
announcRouter.route("/").post(postAnnouncement);
announcRouter.route("/").put(authenticateToken, putAnnouncement);
announcRouter.route("/").delete(authenticateToken, deleteAnnouncement);

export default announcRouter;

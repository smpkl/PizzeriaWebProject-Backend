import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllAnnouncements,
  getAnnouncementById,
  postAnnouncement,
  putAnnouncement,
  deleteAnnouncement,
} from "./announcements-controller.js";

const announcRouter = express.Router();

// Routes related to announcements:
announcRouter.route("/").get(getAllAnnouncements);
announcRouter.route("/:id").get(getAnnouncementById);
announcRouter.route("/").post(postAnnouncement);
announcRouter.route("/").put(putAnnouncement);
announcRouter.route("/").delete(deleteAnnouncement);

export default announcRouter;

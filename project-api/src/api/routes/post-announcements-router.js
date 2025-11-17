import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllAnnouncements,
  getAnnouncementById,
  getAnnouncementsByTagId,
  postAnnouncements,
  postAnnouncementTag,
  deleteAnnouncementTag,
  putAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcements-controller.js";

const announcRouter = express.Router();

announcRouter.route("/").get(getAllAnnouncements).post(postAnnouncements);
announcRouter
  .route("/:id")
  .get(getAnnouncementById)
  .put(putAnnouncement)
  .delete(deleteAnnouncement);

announcRouter
  .route("/announcements/:announcementId/tags")
  .post(postAnnouncementTag);
announcRouter
  .route("/announcements/:announcementId/tags/:tagId")
  .delete(deleteAnnouncementTag);
announcRouter.route("/category/:categoryId").get(getAllAnnouncementsByCategory);
announcRouter.route("/tags/:tagId").get(getAnnouncementsByTagId);

export default announcRouter;

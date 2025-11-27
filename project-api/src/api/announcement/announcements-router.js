import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { validationErrors } from "../../middlewares/error-handler.js";
import { body } from "express-validator";
import { upload, createOriginal } from "../../middlewares/uploads.js";

import {
  getAllAnnouncements,
  getAnnouncementById,
  postAnnouncement,
  putAnnouncement,
  deleteAnnouncement,
} from "./announcements-controller.js";

const announcRouter = express.Router();

// Kuva varmaan tarkistetaan uploadin yhteydessä? Eli sitä ei huomioida tässä chainissa.
const announcementValidationChain = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Announcement title cannot be empty.")
      .bail()
      .isLength({ min: 2, max: 50 })
      .withMessage(
        "Announcement title must be between 2 to 50 characters long."
      ),
    body("text")
      .trim()
      .notEmpty()
      .withMessage("Announcement text cannot be empty.")
      .bail()
      .isLength({ min: 2, max: 700 })
      .withMessage(
        "Announcement text must be between 2 to 700 characters long."
      ),
  ];
};

// Routes related to announcements:
announcRouter.route("/").get(getAllAnnouncements);

announcRouter.route("/:id").get(getAnnouncementById);

announcRouter
  .route("/")
  .post(
    authenticateToken,
    upload.single("file"),
    createOriginal,
    announcementValidationChain(),
    validationErrors,
    postAnnouncement
  );

announcRouter
  .route("/")
  .put(
    authenticateToken,
    upload.single("file"),
    createOriginal,
    announcementValidationChain(),
    validationErrors,
    putAnnouncement
  );

announcRouter.route("/").delete(authenticateToken, deleteAnnouncement);

export default announcRouter;

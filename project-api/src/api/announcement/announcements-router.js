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

const announcementPutValidationChain = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage(
        "Announcement title must be between 2 to 50 characters long."
      ),
    body("text")
      .optional()
      .trim()
      .isLength({ min: 2, max: 700 })
      .withMessage(
        "Announcement text must be between 2 to 700 characters long."
      ),
  ];
};

/**
 * @api {get} /announcements Get all announcements
 * @apiName GetAllAnnouncements
 * @apiGroup Announcements
 *
 * @apiSuccess {Object} message Announcements found.
 * @apiSuccess {Object[]} announcements List of announcements.
 *
 * @apiError (500 ServerError) InternalError Error getting announcements
 */
announcRouter.route("/").get(getAllAnnouncements);

/**
 * @api {get} /announcements/:id Get announcement by its ID
 * @apiName GetAnnouncementById
 * @apiGroup Announcements
 *
 * @apiParam {Number} id Announcement's unique ID.
 *
 * @apiSuccess {Object} success message Announcement found.
 * @apiSuccess {Object} announcement Announcement data.
 *
 * @apiError (404 NotFound) NotFound Announcement not found.
 * @apiError (500 ServerError) InternalError Error getting announcement.
 */
announcRouter.route("/:id").get(getAnnouncementById);

/**
 * @api {post} /announcements Create a new announcement
 * @apiName PostAnnouncement
 * @apiGroup Announcements
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String{2..50}} title Announcement title.
 * @apiBody {String{2..700}} text Announcement text.
 * @apiBody {File} [file] Optional image upload.
 *
 * @apiSuccess {Object} message New announcement added.
 * @apiSuccess {Object} announcementId Created category object's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden You don't have permission to create announcements.
 *
 * @apiError (400 ValidationError) TitleTooShort Title is shorter than 2 characters.
 * @apiError (400 ValidationError) TitleTooLong Title is longer than 50 characters.
 * @apiError (400 ValidationError) TextTooShort Text is shorter than 2 characters.
 * @apiError (400 ValidationError) TextTooLong Text is longer than 700 characters.
 *
 * @apiError (500 ServerError) InternalError Error adding announcement.
 */
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

/**
 * @api {put} /announcements/:id Update an announcement
 * @apiName PutAnnouncement
 * @apiGroup Announcements
 *
 * @apiParam {Number} id Announcement unique ID.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String{2..50}} title Announcement title.
 * @apiBody {String{2..700}} text Announcement text.
 * @apiBody {File} [file] Optional image upload.
 *
 * @apiSuccess {Object} message Announcement info updated.
 * @apiSuccess {Object} announcementId Announcement object's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden You don't have permission to update announcements.
 *
 * @apiError (400 ValidationError) TitleTooShort Title is shorter than 2 characters.
 * @apiError (400 ValidationError) TitleTooLong Title is longer than 50 characters.
 * @apiError (400 ValidationError) TextTooShort Text is shorter than 2 characters.
 * @apiError (400 ValidationError) TextTooLong Text is longer than 700 characters.
 *
 * @apiError (500 ServerError) InternalError Error updating announcement.
 */
announcRouter
  .route("/:id")
  .put(
    authenticateToken,
    upload.single("file"),
    createOriginal,
    announcementPutValidationChain(),
    validationErrors,
    putAnnouncement
  );

/**
 * @api {delete} /announcements/:id Delete an announcement
 * @apiName DeleteAnnouncement
 * @apiGroup Announcements
 *
 * @apiParam {Number} id Announcement unique ID.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object} message Announcement deleted.
 * @apiSuccess {Object} announcementId Announcement object's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden You don't have permission to delete announcements.
 *
 * @apiError (400 BadRequest) BadRequest Could not delete announcement.
 *
 * @apiError (500 ServerError) InternalError Error updating announcement.
 */
announcRouter.route("/:id").delete(authenticateToken, deleteAnnouncement);

export default announcRouter;

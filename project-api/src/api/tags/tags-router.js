import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { body } from "express-validator";
import { validationErrors } from "../../middlewares/error-handler.js";

import {
  deleteTag,
  getTags,
  getTagById,
  postTag,
  putTag,
} from "./tags-controller.js";

const tagsRouter = express.Router();

const tagValidationChain = () => {
  return [
    body("title")
      .trim()
      .notEmpty("Tag must have a title.")
      .bail()
      .isLength({ min: 3, max: 50 })
      .withMessage("Tag title must be between 3 to 50 characters long."),
    body("color_hex")
      .optional()
      .trim()
      .isHexColor()
      .withMessage("Tag color must be in HEX."),
    body("icon")
      .optional()
      .trim()
      .isHash()
      .withMessage("Tag icon file name is not hashed."),
  ];
};

// Routes related to announcements:
tagsRouter.route("/").get(getTags).post(authenticateToken, postTag);

tagsRouter
  .route("/:id")
  .get(getTagById)
  .delete(authenticateToken, deleteTag)
  .put(authenticateToken, putTag);

export default tagsRouter;

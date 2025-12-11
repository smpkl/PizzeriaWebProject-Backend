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
      .notEmpty()
      .withMessage("Tag must have a title.")
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

const tagPutValidationChain = () => {
  return [
    body("title")
      .optional()
      .trim()
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

/**
 * @api {get} /tags Get all tags
 * @apiName GetTags
 * @apiGroup Tags
 *
 * @apiSuccess {String} message Tags found.
 * @apiSuccess {Object[]} tags List of tags.
 * @apiSuccess {Number} tags.id Tag unique ID.
 * @apiSuccess {String} tags.title Tag title.
 * @apiSuccess {String} [tags.color_hex] Tag color as HEX string.
 * @apiSuccess {String} [tags.icon] Tag icon file name.
 *
 * @apiError (500 ServerError) InternalError Error getting tags.
 */
tagsRouter.route("/").get(getTags);

/**
 * @api {post} /tags Create a new tag
 * @apiName PostTag
 * @apiGroup Tags
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String{3..50}} title Tag title.
 * @apiBody {String} [color_hex] Tag color in HEX format.
 * @apiBody {String} [icon] Tag icon hashed filename.
 *
 * @apiSuccess {String} message New tag added.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.tagId New tag ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can create tags.
 *
 * @apiError (400 ValidationError) TitleRequired Tag title is missing or too short/long.
 * @apiError (400 ValidationError) ColorInvalid Tag color is not a valid HEX string.
 * @apiError (400 ValidationError) IconInvalid Tag icon file name is not hashed.
 *
 * @apiError (400 BadRequest) CouldNotAdd Could not add tag.
 * @apiError (500 ServerError) InternalError Error adding tag.
 */
tagsRouter
  .route("/")
  .post(authenticateToken, tagValidationChain(), validationErrors, postTag);

/**
 * @api {get} /tags/:id Get tag by ID
 * @apiName GetTagById
 * @apiGroup Tags
 *
 * @apiParam {Number} id Tag unique ID.
 *
 * @apiSuccess {String} message Tag found.
 * @apiSuccess {Object} tag Tag object.
 * @apiSuccess {Number} tag.id Tag unique ID.
 * @apiSuccess {String} tag.title Tag title.
 * @apiSuccess {String} [tag.color_hex] Tag color as HEX string.
 * @apiSuccess {String} [tag.icon] Tag icon file name.
 *
 * @apiError (404 NotFound) TagNotFound Tag not found.
 * @apiError (500 ServerError) InternalError Error getting tag.
 */
tagsRouter.route("/:id").get(getTagById);

/**
 * @api {delete} /tags/:id Delete tag by ID
 * @apiName DeleteTag
 * @apiGroup Tags
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Tag unique ID.
 *
 * @apiSuccess {String} message Tag deleted.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.tagId Deleted tag ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can delete tags.
 *
 * @apiError (400 BadRequest) CouldNotDelete Could not delete tag.
 * @apiError (500 ServerError) InternalError Error deleting tag.
 */
tagsRouter
  .route("/:id")
  .delete(authenticateToken, deleteTag);

/**
 * @api {put} /tags/:id Update tag
 * @apiName PutTag
 * @apiGroup Tags
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Tag unique ID.
 *
 * @apiBody {String{3..50}} [title] Tag title.
 * @apiBody {String} [color_hex] Tag color in HEX format.
 * @apiBody {String} [icon] Tag icon hashed filename.
 *
 * @apiSuccess {String} message Tag updated.
 * @apiSuccess {Object} result Result object.
 * @apiSuccess {Number} result.tagId Updated tag ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can update tags.
 *
 * @apiError (400 ValidationError) TitleInvalid Tag title is too short/long.
 * @apiError (400 ValidationError) ColorInvalid Tag color is not a valid HEX string.
 * @apiError (400 ValidationError) IconInvalid Tag icon file name is not hashed.
 *
 * @apiError (400 BadRequest) CouldNotUpdate Could not update tag.
 * @apiError (500 ServerError) InternalError Error updating tag.
 */
tagsRouter
  .route("/:id")
  .put(authenticateToken, tagPutValidationChain(), validationErrors, putTag);

export default tagsRouter;

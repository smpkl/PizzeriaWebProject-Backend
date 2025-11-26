import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";

import {
  deleteTag,
  getTags,
  getTagById,
  postTag,
  putTag,
} from "./tags-controller.js";

const tagsRouter = express.Router();

// Routes related to announcements:
tagsRouter.route("/").get(getTags).post(authenticateToken, postTag);

tagsRouter
  .route("/:id")
  .get(getTagById)
  .delete(authenticateToken, deleteTag)
  .put(authenticateToken, putTag);

export default tagsRouter;

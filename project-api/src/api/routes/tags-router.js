import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  deleteTag,
  getAllTags,
  getTagById,
  postTag,
  putTag,
} from "../controllers/tags-controller.js";

const tagsRouter = express.Router();

// Routes related to announcements:
tagsRouter.route("/").get(getAllTags).post(postTag);
tagsRouter.route("/:id").get(getTagById).delete(deleteTag).put(putTag);

export default tagsRouter;

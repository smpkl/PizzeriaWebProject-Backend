import express from "express";
// import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllTags,
  getTagById,
  getTagProducts,
} from "../controllers/tags-controller.js";

const tagsRouter = express.Router();

// Routes related to announcements:
tagsRouter.route("/").get(getAllTags);
tagsRouter.route("/:id").get(getTagById);

tagsRouter.route("/products/:id").get(getTagProducts); // Get all products with a certain tag by tag id (i.e. get all VEG products, get GL products, get all VL products etc.)

export default tagsRouter;

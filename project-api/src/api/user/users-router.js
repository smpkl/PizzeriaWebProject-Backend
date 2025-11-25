import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";

import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  postAdmin,
  postUser,
  putUser,
} from "./users-controller.js";

const usersRouter = express.Router();

// Routes related to announcements:
usersRouter.route("/").get(authenticateToken, getAllUsers).post(postUser); // Ei varmaan haluta että kuka tahansa voi hakea kaikki käyttäjät?
usersRouter.route("/admin").post(authenticateToken, postAdmin); // Vain toinen admin voi luoda uuden admin käyttäjän? Näinkö sovittiin? Tämä tarvitsee tokenin mutta peruskäyttäjän luominen ei.

usersRouter
  .route("/:id")
  .get(getUserById)
  .delete(authenticateToken, deleteUser)
  .put(authenticateToken, putUser);

usersRouter.route("email/:email").get(getUserByEmail);

export default usersRouter;

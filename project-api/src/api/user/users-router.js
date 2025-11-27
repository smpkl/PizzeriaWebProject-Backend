import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { validationErrors } from "../../middlewares/error-handler.js";
import { body } from "express-validator";

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

const userValidationChain = () => {
  return [
    body("first_name")
      .trim()
      .notEmpty()
      .withMessage("Firstname cannot be empty.")
      .bail()
      .isAlpha("fi-FI", { ignore: "-'" })
      .withMessage("Firstname can only contain letters"),
    body("last_name")
      .trim()
      .notEmpty()
      .withMessage("Lastname cannot be empty.")
      .bail()
      .isAlpha("fi-FI", { ignore: "-'" })
      .withMessage("Lastname can only contain letters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email cannot be empty.")
      .bail()
      .isEmail()
      .withMessage("Email must be valid."),
    body("address")
      .trim()
      .notEmpty()
      .withMessage("Address cannot be empty.")
      .bail()
      .isLength({ min: 10, max: 400 })
      .withMessage("Address must be atleast 10 characters long.")
      .bail()
      .isAlphanumeric("en-US", { ignore: " .,':;" })
      .withMessage("Address cannot contain special characters (!, ?, # etc.)."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty.")
      .bail()
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long."),
  ];
};

// Routes related to users:
usersRouter
  .route("/")
  .get(authenticateToken, getAllUsers)
  .post(userValidationChain(), validationErrors, postUser); // Ei varmaan haluta että kuka tahansa voi hakea kaikki käyttäjät?

usersRouter
  .route("/admin")
  .post(authenticateToken, userValidationChain(), validationErrors, postAdmin); // Vain toinen admin voi luoda uuden admin käyttäjän? Näinkö sovittiin? Tämä tarvitsee tokenin mutta peruskäyttäjän luominen ei.

usersRouter
  .route("/:id")
  .get(getUserById)
  .delete(authenticateToken, deleteUser)
  .put(authenticateToken, userValidationChain(), validationErrors, putUser);

usersRouter.route("email/:email").get(getUserByEmail);

export default usersRouter;

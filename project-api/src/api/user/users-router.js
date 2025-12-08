import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";
import { validationErrors } from "../../middlewares/error-handler.js";
import { body } from "express-validator";

import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getCurrentUser,
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
    body("phonenumber")
      .trim()
      .notEmpty()
      .withMessage("Phonenumber cannot be empty.")
      .bail()
      .isLength({ min: 8, max: 50 })
      .withMessage("Phonenumber must be between 8 to 50 characters long."),
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

const userPutValidationChain = () => {
  return [
    body("first_name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Firstname cannot be empty.")
      .bail()
      .isAlpha("fi-FI", { ignore: "-'" })
      .withMessage("Firstname can only contain letters"),
    body("last_name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Lastname cannot be empty.")
      .bail()
      .isAlpha("fi-FI", { ignore: "-'" })
      .withMessage("Lastname can only contain letters"),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Email must be valid."),
    body("phonenumber")
      .optional()
      .trim()
      .isLength({ min: 8, max: 50 })
      .withMessage("Phonenumber must be between 8 to 50 characters long."),
    body("address")
      .optional()
      .trim()
      .isLength({ min: 10, max: 400 })
      .withMessage("Address must be atleast 10 characters long.")
      .bail()
      .isAlphanumeric("en-US", { ignore: " .,':;" })
      .withMessage("Address cannot contain special characters (!, ?, # etc.)."),
    body("password")
      .optional()
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

usersRouter.route("/me").get(authenticateToken, getCurrentUser);

usersRouter
  .route("/:id")
  .get(authenticateToken, getUserById)
  .delete(authenticateToken, deleteUser)
  .put(authenticateToken, userPutValidationChain(), validationErrors, putUser);

usersRouter.route("/email/:email").get(authenticateToken, getUserByEmail);

export default usersRouter;

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

/**
 * @api {get} /users Get all users
 * @apiName GetAllUsers
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Users found.
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {Number} users.user_id User unique ID.
 * @apiSuccess {String} users.first_name First name.
 * @apiSuccess {String} users.last_name Last name.
 * @apiSuccess {String} users.email Email.
 * @apiSuccess {String} users.phonenumber Phone number.
 * @apiSuccess {String} users.address Address.
 * @apiSuccess {String} users.role Role (user/admin).
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (500 ServerError) InternalError Error getting users.
 */
usersRouter
  .route("/")
  .get(authenticateToken, getAllUsers)
  /**
   * @api {post} /users Create a new regular user
   * @apiName PostUser
   * @apiGroup Users
   *
   * @apiBody {String{1..}} first_name First name.
   * @apiBody {String{1..}} last_name Last name.
   * @apiBody {String} email Email (must be valid).
   * @apiBody {String{8..50}} phonenumber Phone number (8–50 chars).
   * @apiBody {String{10..400}} address Address.
   * @apiBody {String{8..}} password Password (min 8 chars).
   *
   * @apiSuccess {String} message New user created.
   * @apiSuccess {Object} result Created user info.
   * @apiSuccess {Number} result.user_id New user's ID.
   *
   * @apiError (400 ValidationError) ValidationError One or more fields are invalid.
   * @apiError (400 BadRequest) CouldNotCreate Could not create user.
   * @apiError (500 ServerError) InternalError Error creating user.
   */
  .post(userValidationChain(), validationErrors, postUser);

/**
 * @api {post} /users/admin Create a new admin user
 * @apiName PostAdmin
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String{1..}} first_name First name.
 * @apiBody {String{1..}} last_name Last name.
 * @apiBody {String} email Email (must be valid).
 * @apiBody {String{8..50}} phonenumber Phone number (8–50 chars).
 * @apiBody {String{10..400}} address Address.
 * @apiBody {String{8..}} password Password (min 8 chars).
 *
 * @apiSuccess {String} message New admin created.
 * @apiSuccess {Object} result Created admin info.
 * @apiSuccess {Number} result.user_id New admin's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only admins can create new admins.
 * @apiError (400 ValidationError) ValidationError One or more fields are invalid.
 * @apiError (400 BadRequest) CouldNotCreate Could not create admin.
 * @apiError (500 ServerError) InternalError Error creating a new admin.
 */
usersRouter
  .route("/admin")
  .post(authenticateToken, userValidationChain(), validationErrors, postAdmin);

/**
 * @api {get} /users/me Get current logged-in user
 * @apiName GetCurrentUser
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Current user found.
 * @apiSuccess {Object} user Current user object.
 * @apiSuccess {Number} user.user_id User unique ID.
 * @apiSuccess {String} user.first_name First name.
 * @apiSuccess {String} user.last_name Last name.
 * @apiSuccess {String} user.email Email.
 * @apiSuccess {String} user.phonenumber Phone number.
 * @apiSuccess {String} user.address Address.
 * @apiSuccess {String} user.role Role (user/admin).
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (400 BadRequest) CouldNotFind Could not find current user.
 * @apiError (500 ServerError) InternalError Error getting current user.
 */
usersRouter.route("/me").get(authenticateToken, getCurrentUser);

/**
 * @api {get} /users/:id Get user by ID
 * @apiName GetUserById
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User unique ID.
 *
 * @apiSuccess {String} message User found.
 * @apiSuccess {Number} user_id User unique ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (404 NotFound) UserNotFound User not found.
 * @apiError (500 ServerError) InternalError Error getting user.
 */

/**
 * @api {put} /users/:id Update user information
 * @apiName PutUser
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User unique ID.
 *
 * @apiBody {String} [first_name] First name.
 * @apiBody {String} [last_name] Last name.
 * @apiBody {String} [email] Email (must be valid).
 * @apiBody {String{8..50}} [phonenumber] Phone number (8–50 chars).
 * @apiBody {String{10..400}} [address] Address.
 * @apiBody {String{8..}} [password] New password (min 8 chars).
 *
 * @apiSuccess {String} message User info updated.
 * @apiSuccess {Object} result Updated user object ID.
 * @apiSuccess {Number} result.user_id Updated user's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only the user or an admin can update this user.
 * @apiError (400 ValidationError) ValidationError One or more fields are invalid.
 * @apiError (400 BadRequest) CouldNotUpdate Could not update user.
 * @apiError (500 ServerError) InternalError Error updating user.
 */

/**
 * @api {delete} /users/:id Delete user by ID
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User unique ID.
 *
 * @apiSuccess {String} message User deleted.
 * @apiSuccess {Object} result Deleted user ID.
 * @apiSuccess {Number} result.user_id Deleted user's ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden Only the user or an admin can delete this user.
 * @apiError (400 BadRequest) CouldNotDelete Could not delete user.
 * @apiError (500 ServerError) InternalError Error deleting user.
 */
usersRouter
  .route("/:id")
  .get(authenticateToken, getUserById)
  .delete(authenticateToken, deleteUser)
  .put(authenticateToken, userPutValidationChain(), validationErrors, putUser);

/**
 * @api {get} /users/email/:email Get user by email
 * @apiName GetUserByEmail
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {String} email User email address.
 *
 * @apiSuccess {String} message User found.
 * @apiSuccess {Number} user_id User unique ID.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (404 NotFound) UserNotFound User not found.
 * @apiError (500 ServerError) InternalError Error getting user.
 */
usersRouter.route("/email/:email").get(authenticateToken, getUserByEmail);

export default usersRouter;

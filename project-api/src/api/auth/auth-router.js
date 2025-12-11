import express from "express";
import { postAdminLogin, postUserLogin } from "./auth-controller.js";

const authRouter = express.Router();

/**
 * @api {post} /auth/admin/login Login as an admin
 * @apiName AdminLogin
 * @apiGroup Authorization
 *
 * @apiBody {String} email Email of the admin user.
 * @apiBody {String} password Password of the admin user.
 *
 * @apiSuccess {String} token Unique token for requests that require it.
 * @apiSuccess {Object} user User data for admin user.
 *
 * @apiError (404 NotFound) NotFound User not found.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 * @apiError (403 Forbidden) Forbidden You don't have permission to login as an admin.
 */
authRouter.route("/admin/login").post(postAdminLogin);

/**
 * @api {post} /auth/user/login Login as a regular user
 * @apiName UserLogin
 * @apiGroup Authorization
 *
 * @apiBody {String} email Email of the regular user.
 * @apiBody {String} password Password of the regular user.
 *
 * @apiSuccess {String} token Unique token for requests that require it.
 * @apiSuccess {Object} user User data for a regular user.
 *
 * @apiError (404 NotFound) NotFound User not found.
 *
 * @apiError (401 Unauthorized) Unauthorized Missing or invalid token.
 */
authRouter.route("/user/login").post(postUserLogin);

export default authRouter;

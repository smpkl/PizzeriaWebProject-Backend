import express from "express";
import {
  postAdminLogin,
  postUserLogin,
} from "../controllers/auth-controller.js";
import { authenticateToken } from "../../middlewares/authentication.js";

const authRouter = express.Router();

authRouter.route("/admin/login").post(postAdminLogin);
authRouter.route("/user/login").post(postUserLogin);

export default authRouter;

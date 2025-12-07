import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findOneUserByEmail } from "../user/users-model.js";
import "dotenv/config";

/**
 * For logging in to the admin site: Find user by email via user model, check if they are an admin and check password match:
 */
const postAdminLogin = async (req, res, next) => {
  console.log("Admin login...");
  const user = await findOneUserByEmail(req.body.email);
  console.log(user);
  if (!user) {
    next({ status: 404, message: "User not found" });
    return;
  }

  if (user.role !== "admin") {
    next({ status: 403, message: "Forbidden" });
    return;
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (!passwordMatch) {
    next({ status: 401, message: "Unauthorized" });
    return;
  }

  const userDetails = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phonenumber: user.phonenumber,
    address: user.address,
    role: user.role,
  };

  const token = jwt.sign(userDetails, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.json({ user: userDetails, token });
};

/**
 * For logging in to the regular site: Find user by email via user model and check password match:
 */
const postUserLogin = async (req, res, next) => {
  const user = await findOneUserByEmail(req.body.email);

  if (!user) {
    next({ status: 404, message: "User not found" });
    return;
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (!passwordMatch) {
    next({ status: 401, message: "Unauthorized" });
    return;
  }

  const userDetails = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phonenumber: user.phonenumber,
    address: user.address,
    role: user.role,
  };

  const token = jwt.sign(userDetails, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.json({ user: userDetails, token });
};

export { postAdminLogin, postUserLogin };

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../models/user-model.js";
import "dotenv/config";

/**
 * For logging in to the admin site: Find user by email via user model, check if they are an admin and check password match:
 */
const postAdminLogin = async (req, res, next) => {
  const user = await findUserByEmail(req.body.email);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (!passwordMatch) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userDetails = {
    user_id: user.id,
    firstname: user.first_name,
    lastname: user.last_name,
    email: user.email,
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
  const user = await findUserByEmail(req.body.email);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (!passwordMatch) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userDetails = {
    user_id: user.id,
    firstname: user.first_name,
    lastname: user.last_name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userDetails, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.json({ user: userDetails, token });
};

export { postAdminLogin, postUserLogin };

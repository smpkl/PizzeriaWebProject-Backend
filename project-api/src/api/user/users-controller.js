import {
  addNewUser,
  findOneUserById,
  findOneUserByEmail,
  findAllUsers,
  removeUser,
  modifyUserById,
} from "./users-model.js";
import bcrypt from "bcrypt";

/**
 * Direct the POST users/admin-request to model (try to create a new admin user)
 */
const postAdmin = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const admin = { ...req.body, role: "admin" };

    const result = await addNewUser(admin);
    if (result.user_id) {
      res.status(200).json({ message: "New admin created", result });
    } else {
      next({ status: 400, message: "Could not create admin" });
    }
  } catch (error) {
    console.log(error);
    next({ status: 500, message: "Error creating a new admin" });
  }
};

/**
 * Direct the POST users/-request to model (try to create a new regular user)
 */
const postUser = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = { ...req.body, role: "user" };
    const result = await addNewUser(user);
    if (result.user_id) {
      res.status(200).json({ message: "New user created", result });
    } else {
      next({ status: 400, message: "Could not create user" });
    }
  } catch (error) {
    next({ status: 500, message: "Error creating user" });
  }
};

/**
 * Direct the GET users/-request to model
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await findAllUsers();
    res.status(200).json({ message: "Users found", users });
  } catch (error) {
    next({ status: 500, message: "Error getting users" });
  }
};

/**
 * Direct the GET users/:id-request to model
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await findOneUserById(req.params.id);
    if (user) {
      res.status(200).json({ message: "User found", user_id: user.id });
    } else {
      console.log(user);
      next({ status: 404, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    next({ status: 500, message: "Error getting user" });
  }
};

/**
 * Direct the GET users/email/:email-request to model
 */
const getUserByEmail = async (req, res, next) => {
  try {
    const user = await findOneUserByEmail(req.params.email);
    if (user) {
      res.status(200).json({ message: "User found", user_id: user.id });
    } else {
      next({ status: 404, message: "User not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting user" });
  }
};

/**
 * Direct the GET users/me-request to model
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    console.log("User controller: ", currentUser);
    const user = await findOneUserById(currentUser.user_id);
    if (user) {
      res.status(200).json({ message: "Current user found", user });
    } else {
      next({ status: 400, message: "Could not find current user" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting current user" });
  }
};

/**
 * Direct the PUT users/:id-request to model (users can only update their own info, admins can update anyone's info)
 */
const putUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const currentUser = res.locals.user;
    if (
      currentUser.role !== "admin" &&
      currentUser.user_id !== Number(userId)
    ) {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const newInfo = req.body;

    if (newInfo.password) {
      newInfo.password = await bcrypt.hash(newInfo.password, 10);
    }

    const result = await modifyUserById(userId, newInfo);
    if (result.user_id) {
      res.status(200).json({ message: "User info updated", result });
    } else {
      next({ status: 400, message: "Could not update user" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating user" });
  }
};

/**
 * Direct the DELETE users/:id-request to model (users can only delete their own account, admins can delete anyone's account)
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const currentUser = res.locals.user;
    if (
      currentUser.role !== "admin" &&
      currentUser.user_id !== Number(userId)
    ) {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const result = await removeUser(userId);
    if (result) {
      res.status(200).json({ message: "User deleted", result });
    } else {
      next({ status: 400, message: "Could not delete user" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting user" });
  }
};

export {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getCurrentUser,
  postAdmin,
  postUser,
  putUser,
  deleteUser,
};

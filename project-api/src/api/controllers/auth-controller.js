import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findAdminByLastnameAndFirstname } from "../models/admin-model.js";
import "dotenv/config";

const postAdminLogin = async (req, res, next) => {
  console.log("Admin Login", req.body);
  const admin = await findAdminByLastnameAndFirstname(
    req.body.last_name,
    req.body.first_name
  );
  if (!admin) {
    next({ status: 400, message: "User was not found" });
    return;
  }

  const passwordMatch = await bcrypt.compare(req.body.password, admin.password);

  if (!passwordMatch) {
    next({ status: 401, message: "Unauthorized" });
    return;
  }

  const adminDetails = {
    admin_id: admin.id,
    firstname: admin.first_name,
    lastname: admin.last_name,
    email: admin.email,
  };

  const token = jwt.sign(adminDetails, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.json({ admin: adminDetails, token });
};

export { postAdminLogin };

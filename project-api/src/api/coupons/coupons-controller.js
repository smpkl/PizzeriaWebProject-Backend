import {
  findAllCoupons,
  findCouponById,
  modifyCouponById,
  addNewCoupon,
  removeCoupon,
} from "./coupons-model.js";

const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await findAllCoupons();
    res.status(200).json({ message: "Coupons found", coupons });
  } catch (error) {
    next({ status: 500, message: "Error getting coupons" });
  }
};

const getCouponById = async (req, res, next) => {
  try {
    const coupon = await findCouponById(req.params.id);
    if (coupon) {
      res.status(200).json({ message: "Coupon found", coupon });
    } else {
      next({ status: 404, message: "Coupon not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting coupon" });
  }
};

const addCoupon = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const newCouponAdded = await addNewCoupon(req.body);
    if (newCouponAdded) {
      res
        .status(201)
        .json({ message: "New coupon added successfully", newCouponAdded });
    } else {
      res.status(400).json({ message: "Check your request" });
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding new coupon" });
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const updateComplete = await modifyCouponById(req.params.id, req.body);
    if (updateComplete) {
      res.status(200).json({ message: "Coupon update was successfull" });
    } else {
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    console.log(error);
    next({ status: 500, message: "Error updating a coupon" });
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const id = req.params.id;
    const result = await removeCoupon(id);
    if (result) {
      res.status(200).json({ message: "Coupon deleted", result });
    } else {
      next({ status: 400, message: "Could not delete coupon" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting coupon" });
  }
};

export { getAllCoupons, getCouponById, addCoupon, updateCoupon, deleteCoupon };

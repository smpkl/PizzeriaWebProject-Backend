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
    res.status(200).json({ message: "Orders found", coupons });
  } catch (error) {
    next({ status: 500, message: "Error getting orders" });
  }
};

const getCouponById = async (req, res, next) => {
  try {
    const coupon = await findCouponById(req.params.id);
    if (coupon) {
      res.status(200).json({ message: "Order found", coupon });
    } else {
      next({ status: 404, message: "Order not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting order" });
  }
};

const addCoupon = async (req, res, next) => {
  try {
    const newCouponAdded = await addNewCoupon(req.body);
    if (newCouponAdded) {
      res.status(201).json({ message: "New order added successfully" });
    } else {
      res.status(400).json({ message: "Check your request" });
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding new order" });
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const updateComplete = await modifyCouponById(req.body);
    if (updateComplete) {
      res.status(200).json({ message: "Update was successfull" });
    } else {
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating a order" });
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
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

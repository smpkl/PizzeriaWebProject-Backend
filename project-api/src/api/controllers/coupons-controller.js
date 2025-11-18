import {
  findAllCoupons,
  findCouponById,
  modifyCouponById,
  addNewCoupon,
} from "../models/coupons-model";

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await findAllCoupons();
    res.status(200).json({ message: "Orders found", coupons });
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

const getCouponById = async (req, res) => {
  try {
    const coupon = await findCouponById(req.params.id);
    if (coupon) {
      res.status(200).json({ message: "Order found", coupon });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting order" });
  }
};

const addCoupon = async (req, res) => {
  try {
    const newCouponAdded = await addNewCoupon(req.body);
    if (newCouponAdded) {
      res.status(201).json({ message: "New order added successfully" });
    } else {
      res.status(400).json({ message: "Check your request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding new order" });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const updateComplete = await modifyCouponById(req.body);
    if (updateComplete) {
      res.status(200).json({ message: "Update was successfull" });
    } else {
      res.status(400).json({ message: "Check your request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating a order" });
  }
};

export { getAllCoupons, getCouponById, addCoupon, updateCoupon };

import {
  findAllOrders,
  findOneOrderById,
  findAllOrdersByUserId,
  addNewOrder,
  modifyOrderById,
  removeOrder,
} from "./order-model.js";

// For meals:

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await findAllOrders();
    res.status(200).json({ message: "Orders found", orders });
  } catch (error) {
    next({ status: 500, message: "Error getting orders" });
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await findOneOrderById(req.params.id);
    if (order) {
      res.status(200).json({ message: "Order found", order });
    } else {
      next({ status: 404, message: "Order not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting order" });
  }
};

const getAllUsersOrders = async (req, res, next) => {
  try {
    const orders = await findAllOrdersByUserId(req.params.id);
    if (orders) {
      res.status(200).json({ message: "User orders found", orders });
    } else {
      next({ status: 404, message: "User orders not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting user orders" });
  }
};

const addOrder = async (req, res, next) => {
  try {
    const newOrderAdded = await addNewOrder(req.body);
    if (newOrderAdded) {
      res.status(201).json({ message: "New order added successfully" });
    } else {
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding new order" });
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const updateComplete = await modifyOrderById(req.body);
    if (updateComplete) {
      res.status(200).json({ message: "Update was successfull" });
    } else {
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating a order" });
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await removeOrder(id);
    if (result) {
      res.status(200).json({ message: "Order deleted", result });
    } else {
      next({ status: 400, message: "Could not delete order" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting order" });
  }
};

export {
  getAllOrders,
  getOrderById,
  getAllUsersOrders,
  addOrder,
  updateOrder,
  deleteOrder,
};

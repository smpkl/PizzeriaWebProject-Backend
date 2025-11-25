import {
  findAllOrders,
  findOneOrderById,
  findAllOrdersByUserId,
  addNewOrder,
  modifyOrderById,
  removeOrder,
} from "./order-model.js";

// For meals:

const getAllOrders = async (req, res) => {
  try {
    const orders = await findAllOrders();
    res.status(200).json({ message: "Orders found", orders });
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await findOneOrderById(req.params.id);
    if (order) {
      res.status(200).json({ message: "Order found", order });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting order" });
  }
};

const getAllUsersOrders = async (req, res) => {
  try {
    const orders = await findAllOrdersByUserId(req.params.id);
    if (orders) {
      res.status(200).json({ message: "User orders found", orders });
    } else {
      res.status(404).json({ message: "User orders not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting user orders" });
  }
};

const addOrder = async (req, res) => {
  try {
    const newOrderAdded = await addNewOrder(req.body);
    if (newOrderAdded) {
      res.status(201).json({ message: "New order added successfully" });
    } else {
      res.status(400).json({ message: "Check your request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding new order" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updateComplete = await modifyOrderById(req.body);
    if (updateComplete) {
      res.status(200).json({ message: "Update was successfull" });
    } else {
      res.status(400).json({ message: "Check your request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating a order" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await removeOrder(id);
    if (result) {
      res.status(200).json({ message: "Order deleted", result });
    } else {
      res.status(400).json({ message: "Could not delete order" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
};

export { getAllOrders, getOrderById, getAllUsersOrders, addOrder, updateOrder, deleteOrder };

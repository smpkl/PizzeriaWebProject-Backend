import {
  getAllOrders,
  getOneOrderById,
  getAllOrdersByUserId,
  addNewOrder,
  modifyOrderById,
} from "../models/order-model.js";

const findAllOrders = async (req, res) => {
  try {
    const results = await getAllOrders();
    res.status(200).json({ message: "Orders found", results });
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

const findOrderById = async (req, res) => {
  try {
    const results = await getOneOrderById(req.params.id);
    console.log(results);
    if (results) {
      res.status(200).json({ message: "Order found", results });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting order" });
  }
};

const getOrdersByTagId = async (req, res) => {
  try {
    const [announcements] = await getAllOrdersByUserId(req.params.tagId);
    if (announcements) {
      res.status(200).json({ message: "Orders found", products });
    } else {
      res.status(404).json({ message: "Orders not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

const postOrder = async (req, res) => {
  try {
    const newOrder = req.body;
    const result = await addNewOrder(newOrder);
    if (result.orderId) {
      res.status(200).json({ message: "New order added", result });
    } else {
      res.status(400).json({ message: "Could not add order" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding order" });
  }
};

const putOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const newOrderInfo = req.body;
    const result = await modifyOrderById(orderId, newOrderInfo);
    if (result.orderId) {
      res.status(200).json({ message: "Order info updated", result });
    } else {
      res.status(400).json({ message: "Could not update order" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await removeOrder(orderId);
    console.log(result);
    if (result.orderId) {
      res.status(200).json({
        message: "Order deleted",
        result,
      });
    } else {
      res.status(400).json({
        message: "Could not delete order",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
};

export {
  findAllOrders,
  findOrderById,
  getOrdersByTagId,
  postOrder,
  putOrder,
  deleteOrder,
};

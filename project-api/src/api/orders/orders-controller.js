import e from "express";
import {
  findAllOrders,
  findOneOrderById,
  findAllOrdersByUserId,
  addNewOrder,
  modifyOrderById,
  removeOrder,
  removeOrderProduct,
  addOrderProduct,
  findOrderProducts,
} from "./order-model.js";

// For meals:

const getAllOrders = async (req, res, next) => {
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
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (
      currentUser.role !== "admin" &&
      currentUser.user_id !== Number(req.params.id)
    ) {
      next({ status: 403, message: "Forbidden" });
      return;
    }

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
    const order = await addNewOrder(req.body);
    if (order) {
      res.status(201).json({
        message: "New order added successfully",
        order_id: order.order_id,
      });
    } else {
      console.log(order);
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    console.log(error);
    next({ status: 500, message: "Error adding new order" });
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const updateComplete = await modifyOrderById(req.params.id, req.body);
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

const getOrderProducts = async (req, res, next) => {
  try {
    const products = await findOrderProducts(req.params.orderId);
    console.log(products);
    if (products) {
      res.status(200).json({ message: "Order products found", products });
    } else {
      next({ status: 404, message: "Order products not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting order products" });
  }
};

/**
 * Direct the POST orders/:id/products-request to model (Add a product to order)
 */
const postOrderProduct = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const productId = req.body.product_id;
    const quantity = req.body.quantity;
    console.log(orderId, productId);

    const result = await addOrderProduct(productId, orderId, quantity);
    if (result) {
      res
        .status(200)
        .json({ message: "New product added to an order", result });
    } else {
      next({ status: 400, message: "Could not add product to an order" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding product to an order" });
  }
};

/**
 * Direct the DELETE orders/:id/products -request to model (Delete a product from an order)
 */
const deleteOrderProduct = async (req, res, next) => {
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
    const productId = req.params.productId;
    const orderId = req.params.orderId;
    const result = await removeOrderProduct(productId, orderId);
    if (result) {
      res
        .status(200)
        .json({ message: "Product removed from an order", result });
    } else {
      next({
        status: 400,
        message: "Could not remove a product from an order",
      });
    }
  } catch (error) {
    next({ status: 500, message: "Error removing product from an order" });
  }
};

export {
  getAllOrders,
  getOrderById,
  getAllUsersOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  deleteOrderProduct,
  postOrderProduct,
  getOrderProducts,
};

import promisePool from "../../utils/database.js";

//SQL have order in its syntax so table should be entered this way
const tableName = "`order`";
/**
 * Query for getting all orders
 * @returns all current orders
 */
const findAllOrders = async () => {
  const [orders] = await promisePool.query(`select * from ${tableName}`);
  return orders;
};

/**
 * Query for order by id
 * @param {*} id orders id
 * @returns false if no orders found, order if found
 */
const findOneOrderById = async (id) => {
  const [order] = await promisePool.query(
    `SELECT * FROM ${tableName} WHERE id = ?`,
    [id]
  );
  if (order.length === 0) {
    return false;
  }
  return order[0];
};

/**
 * Query for all orders per user
 * @param {*} userId users id
 * @returns false if no orders found, list of orders if found
 */
const findAllOrdersByUserId = async (userId) => {
  const [orders] = await promisePool.query(
    `SELECT * FROM ${tableName} WHERE user_id = ?`,
    [userId]
  );
  if (orders.length === 0) {
    return false;
  }
  return orders;
};

/**
 * Query for adding new order to the database
 * @param {*} order is order JSON with all necessary informatiom
 * @returns false if it was faile to add, JSON { orderId: result[0].insertId }
 * if added to the database
 */
const addNewOrder = async (order) => {
  const { userId, status, orderType, deliveryAddress, pizzeriaAddress, price } =
    order;
  const sql = `INSERT INTO ${tableName} (user_id, status, order_type, delivery_address, pizzeria_address, price) 
               Values (?, ?, ?, ?, ?, ?)`;
  const params = [
    userId,
    status,
    orderType,
    deliveryAddress,
    pizzeriaAddress,
    price,
  ];
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { orderId: result[0].insertId };
};

/**
 * Updates new information to the database
 * @param {*} id id of order wanted to update
 * @param {*} newInfo JSON with all columns info sql of information that is wanted to upgrade.
 * Can include null values of fields that is wanted to stick as same.
 * @returns false if order is not found by its id or update fails,
 * if update goes through it returns JSON {orderId: id}
 */
const modifyOrderById = async (id, newInfo) => {
  const order = await findOneOrderById(id);
  if (order) {
    const {
      user_id,
      status,
      order_type,
      delivery_address,
      pizzeria_address,
      price,
    } = order;
    const updateJSON = {
      userId: newInfo.userId ?? user_id,
      status: newInfo.status ?? status,
      orderType: newInfo.orderType ?? order_type,
      deliveryAddress: newInfo.deliveryAddress ?? delivery_address,
      pizzeriaAddress: newInfo.pizzeriaAddress ?? pizzeria_address,
      price: newInfo.price ?? price,
    };
    const sql = `
    UPDATE ${tableName}
    SET user_id = ?, status = ?, order_type = ?, delivery_address = ?, pizzeria_address = ?, price = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.userId,
      updateJSON.status,
      updateJSON.orderType,
      updateJSON.deliveryAddress,
      updateJSON.pizzeriaAddress,
      updateJSON.price,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { orderId: id };
  } else {
    return false;
  }
};

/**
 * Query for removing a order
 * @param {*} id order unique id
 * @returns false if order could not be deleted, order_Id if coupon was deleted
 */
const removeOrder = async (id) => {
  try {
    const result = await promisePool.execute(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id]
    );
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { order_Id: id };
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Query for order products by order id
 * @param {*} id order unique id
 * @returns false if no product found, list of products if found
 */
const findOrderProducts = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT products.* FROM order_products LEFT JOIN products ON product_id = products.id WHERE order_id = ?",
    [id]
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows;
};

/**
 * Query for inserting a new order-product pair into order_products table aka adds a product to an order
 * @param {*} productId the id of the product to which the order will be attached to
 *  @param {*} orderId the id of the order to which the product will be attached to
 * @returns false if failed to create an new order-product pair, JSON {product_id: productId, order_id: orderId} if completed
 */
const addOrderProduct = async (productId, orderId) => {
  try {
    const result = await promisePool.execute(
      " INSERT INTO order_products (product_id, order_id) VALUES (?, ?)",
      [Number(productId), Number(orderId)]
    );
    console.log(result);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { product_id: Number(productId), order_id: Number(orderId) };
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Query for removing an order-product pair from order_products table aka removes a product from an order
 * @param {*} productId the id of the product to which the order is attached to
 *  @param {*} orderId the id of the order to which the product is attached to
 * @returns false if failed to remove order-product pair, JSON {product_id: productId, order_id: orderId} if completed
 */
const removeOrderProduct = async (productId, orderId) => {
  try {
    const result = await promisePool.execute(
      " DELETE FROM order_products WHERE product_id = ? AND order_id = ?",
      [Number(productId), Number(orderId)]
    );
    console.log(result);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { product_id: Number(productId), order_id: Number(orderId) };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  findAllOrders,
  findOneOrderById,
  findAllOrdersByUserId,
  addNewOrder,
  modifyOrderById,
  removeOrder,
  addOrderProduct,
  removeOrderProduct,
  findOrderProducts,
};

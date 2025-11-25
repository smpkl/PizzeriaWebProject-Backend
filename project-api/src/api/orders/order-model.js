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

export {
  findAllOrders,
  findOneOrderById,
  findAllOrdersByUserId,
  addNewOrder,
  modifyOrderById,
  removeOrder,
};

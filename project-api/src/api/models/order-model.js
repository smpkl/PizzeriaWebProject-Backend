import promisePool from "../../utils/database.js";
/**
 * Query for getting all orders
 * @returns all current orders
 */
const getAllOrders = async () => {
  return await promisePool.query(`select * from order`);
};

/**
 * Query for order by id
 * @param {*} id orders id
 * @returns false if no orders found, order if found
 */
const getOneOrderById = async (id) => {
  const [order] = await promisePool.query(`SELECT * FROM order WHERE id = ?`, [
    id,
  ]);
  if (order.length === 0) {
    return false;
  }
  return order;
};


/**
 * Query for all orders per user
 * @param {*} userId users id
 * @returns false if no orders found, list of orders if found
 */
const getAllOrdersByUserId = async (userId) => {
  const [orders] = await promisePool.query(
    `SELECT * FROM ORDER WHERE user_id = ?`,
    userId
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
  const sql = `INSERT INTO order (user_id, status, order_type, delivery_address, pizzeria_address, price) 
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
  const order = await getOneOrderById(id);
  if (order) {
    const {
      userId,
      status,
      orderType,
      deliveryAddress,
      pizzeriaAddress,
      price,
    } = order;
    const updateJSON = {
      userId: newInfo.userId ?? userId,
      status: newInfo.status ?? status,
      orderType: newInfo.orderType ?? orderType,
      deliveryAddress: newInfo.deliveryAddress ?? deliveryAddress,
      pizzeriaAddress: newInfo.pizzeriaAddress ?? pizzeriaAddress,
      price: newInfo.price ?? price,
    };
    const sql = `
    UPDATE order
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

export { getAllOrders, getOneOrderById, getAllOrdersByUserId, addNewOrder, modifyOrderById };

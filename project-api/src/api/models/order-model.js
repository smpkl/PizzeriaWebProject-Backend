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
  const [order] = await promisePool.query(
    `select * from order where id = ?)`,
    [id]
  );
  if (order.length === 0) {
    return false;
  }
  return order;
};

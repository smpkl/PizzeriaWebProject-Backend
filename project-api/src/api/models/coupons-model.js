import promisePool from "../../utils/database.js";
/**
 * query for 
 * @returns list of all coupons
 */

const getAllCoupons = async () => {
  return await promisePool.query("SELECT * FROM coupons");
};

/**
 * Query for coupon by id
 * @param {*} id coupon unique id
 * @returns false if coupon not found, coupon if found
 */
const getOneCoupibById = async (id) => {
  const [coupon] = await promisePool.query(`SELECT * FROM coupons WHERE ID = ?)`, [
    id,
  ]);
  if (coupon.length === 0) {
    return false;
  }
  return coupon;
};

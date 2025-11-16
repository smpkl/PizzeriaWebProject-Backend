import promisePool from "../../utils/database.js";
/**
 * query for
 * @returns list of all coupons
 */

const findAllCoupons = async () => {
  return await promisePool.query("SELECT * FROM coupons");
};

/**
 * Query for coupon by id
 * @param {*} id coupon unique id
 * @returns false if coupon not found, coupon if found
 */
const findCouponById = async (id) => {
  const [coupon] = await promisePool.query(
    `SELECT * FROM coupons WHERE ID = ?)`,
    [id]
  );
  if (coupon.length === 0) {
    return false;
  }
  return coupon[0];
};

/**
 * Query for adding new coupon to the database
 * @param {*} couponData is JSON with all necessary information
 * @returns false if it was faile to add, JSON { couponId: result[0].insertId }
 * if added to the database
 */
const addNewCoupon = async (couponData) => {
  const { coupon, discount_percentage, start_date, end_date } = couponData;
  const sql = `INSERT INTO coupons (coupon, discount_percentage, start_date, end_date) 
               VALUES (?, ?, ?, ?)`;
  const params = [coupon, discount_percentage, start_date, end_date];
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { couponId: result[0].insertId };
};

/**
 * Updates new information of coupon to the database
 * @param {*} id id of coupon wanted to update
 * @param {*} newInfo JSON with all columns info sql of information that is wanted to upgrade.
 * Can include null values of fields that are not wanted to update.
 * @returns false if coupon is not found by its id or update fails,
 * if update goes through it returns JSON {couponId: id}
 */
const modifyCouponById = async (id, newInfo) => {
  const coupon = await findCouponById(id);
  if (coupon) {
    const {
      coupon: currentCoupon,
      discount_percentage,
      start_date,
      end_date,
    } = coupon[0];

    const updateJSON = {
      coupon: newInfo.coupon ?? currentCoupon,
      discount_percentage: newInfo.discount_percentage ?? discount_percentage,
      start_date: newInfo.start_date ?? start_date,
      end_date: newInfo.end_date ?? end_date,
    };

    const sql = `
    UPDATE coupons
    SET coupon = ?, discount_percentage = ?, start_date = ?, end_date = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.coupon,
      updateJSON.discount_percentage,
      updateJSON.start_date,
      updateJSON.end_date,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { couponId: id };
  } else {
    return false;
  }
};

export { findAllCoupons, findCouponById, modifyCouponById, addNewCoupon };

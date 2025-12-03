import promisePool from "../../utils/database.js";

/**
 * Fetch all dailymeals and all the info from the table
 * @returns list of dailymeals
 */
const findAllDailymeals = async () => {
  const [daily_meals] = await promisePool.query(
    "SELECT daily_meals.day, meals.id as meal_id, meals.name as meal_name, meals.price as meal_price, meals.filename as meal_filename FROM daily_meals LEFT JOIN meals ON meals.id = daily_meals.meal_id;"
  );
  return daily_meals;
};

/**
 * Query for dailymeal by day
 * @param {*} day is unique day
 * @returns false if not found or dailymeal info if found
 */
const findDailymealByDay = async (day) => {
  const [dailymeal] = await promisePool.query(
    `SELECT meals.* FROM meals INNER JOIN daily_meals ON meals.id = daily_meals.meal_id WHERE daily_meals.day = ?`,
    [day]
  );
  console.log(dailymeal);
  if (dailymeal.length === 0) {
    return false;
  }
  return dailymeal[0];
};

/**
 * Updates new information of dailymeal to the database
 * @param {*} day day wanted to update
 * @param {*} newInfo JSON with all columns info sql of information that is wanted to upgrade.
 * Can include null values of fields that are not wanted to update.
 * @returns false if dailymenu is not found by day or update fails,
 * if update goes through it returns JSON {day: day, meal_id: updateJSON.meal_id}
 */
const modifyDailymealByDay = async (day, newInfo) => {
  const dailymeal = await findDailymealByDay(day);
  if (dailymeal) {
    const { meal_id } = dailymeal;
    const updateJSON = {
      meal_id: newInfo.meal_id ?? meal_id,
    };
    const sql = `
    UPDATE daily_meals
    SET meal_id = ?
    WHERE day = ?`;
    const result = await promisePool.execute(sql, [updateJSON.meal_id, day]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { day: day, meal_id: updateJSON.meal_id };
  } else {
    return false;
  }
};

export { findAllDailymeals, findDailymealByDay, modifyDailymealByDay };

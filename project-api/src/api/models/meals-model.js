/**
 * Query for all meals
 * @returns all meals as a list
 */
const findAllMeals = async () => {
  return await promisePool.query("SELECT * FROM meals");
};

/**
 * Query for meal by id
 * @param {*} id meal unique id
 * @returns false if no meal found, meal if found
 */
const findMealById = async (id) => {
  const [meal] = await promisePool.query(`SELECT * FROM meals WHERE ID = ?)`, [
    id,
  ]);
  if (meal.length === 0) {
    return false;
  }
  return meal;
};

/**
 * Query for meal products by meal id
 * @param {*} id meal unique id
 * @returns false if no product found, list of products if found
 */
const findMealProducts = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT products.* FROM meals_products LEFT JOIN products ON product_id = products.id WHERE meal_id = ?",
    [id]
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows;
};

export { findAllMeals, findMealById, findMealProducts };

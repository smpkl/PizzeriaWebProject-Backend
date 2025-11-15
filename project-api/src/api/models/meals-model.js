
/**
 * Query for all meals
 * @returns all meals as a list
 */
const getAllMeals = async () => {
  return await promisePool.query("SELECT * FROM meals");
};

/**
 * Query for meal by id
 * @param {*} id meal unique id
 * @returns false if no meal found, meal if found
 */
const getOneMealById = async (id) => {
  const [meal] = await promisePool.query(`SELECT * FROM meals WHERE ID = ?)`, [
    id,
  ]);
  if (meal.length === 0) {
    return false;
  }
  return meal;
};

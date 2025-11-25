import promisePool from "../../utils/database.js";
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

/**
 * Query for adding new meal to the database
 * @param {*} meal is order JSON with all necessary informatiom
 * @returns false if it was faile to add, JSON { mealId: result[0].insertId }
 * if added to the database
 */
const addNewMeal = async (meal) => {
  const { name, price } = meal;
  const sql = `INSERT INTO ${tableName} (name, price) 
               Values (?, ?)`;
  const params = [name, price];
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { mealId: result[0].insertId };
};

/**
 * Updates new information of meal to the database
 * @param {*} id id of meal wanted to update
 * @param {*} newInfo JSON with all columns info sql of information that is wanted to upgrade.
 * Can include null values of fields that are not wanted to update.
 * @returns false if meal is not found by its id or update fails,
 * if update goes through it returns JSON {mealId: id}
 */
const modifyMealById = async (id, newInfo) => {
  const meal = await findMealById(id);
  if (meal) {
    const { name, price } = meal;
    const updateJSON = {
      name: newInfo.name ?? name,
      price: newInfo.price ?? price,
    };
    const sql = `
    UPDATE ${tableName}
    SET name = ?, price = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.name,
      updateJSON.price,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { mealId: id };
  } else {
    return false;
  }
};

/**
 * Query for removing a meal
 * @param {*} id meal unique id
 * @returns false if meal could not be deleted, meal_Id if coupon was deleted
 */
const removeMeal = async (id) => {
  try {
    const result = await promisePool.execute(`DELETE FROM meals WHERE id = ?`, [
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { meal_Id: id };
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Query for inserting a new meal-product pair into meals_products table aka adds a product to a meal
 * @param {*} productId the id of the product to which the meal will be attached to
 *  @param {*} mealId the id of the meal to which the product will be attached to
 * @returns false if failed to create an new meal-product pair, JSON {product_id: productId, meal_id: mealId} if completed
 */
const addMealProduct = async (productId, mealId) => {
  try {
    const result = await promisePool.execute(
      " INSERT INTO meals_products (product_id, meal_id) VALUES (?, ?)",
      [Number(productId), Number(mealId)]
    );
    console.log(result);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { product_id: Number(productId), meal_id: Number(mealId) };
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Query for removing a meal-product pair from meals_products table aka removes a product from a meal
 * @param {*} productId the id of the product to which the meal is attached to
 *  @param {*} mealId the id of the meal to which the product is attached to
 * @returns false if failed to remove meal-product pair, JSON {product_id: productId, meal_id: mealId} if completed
 */
const removeMealProduct = async (productId, tagId) => {
  try {
    console.log(productId, tagId);
    const result = await promisePool.execute(
      " DELETE FROM meals_products WHERE product_id = ? AND meal_id = ?",
      [Number(productId), Number(mealId)]
    );
    console.log(result);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { product_id: Number(productId), meal_id: Number(mealId) };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  findAllMeals,
  findMealById,
  findMealProducts,
  modifyMealById,
  addNewMeal,
  removeMeal,
  removeMealProduct,
  addMealProduct,
};

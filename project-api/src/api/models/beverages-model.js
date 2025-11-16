import promisePool from "../../utils/database.js";
// files table name as variable, because name of the table might change
const tableName = "foods";

/**
 * Fetch all beverages and all the info from the table
 * @returns list of beverages
 */
const getAllBeverages = async () => {
  const [beverages] = await promisePool.query(`select * from ${tableName}`);
  return beverages;
};

/**
 * Query for beverage/food by id
 * @param {*} id is beverage/foods id
 * @returns false if not found or beverage information
 */

const getOneBeverageById = async (id) => {
  const [beverage] = await promisePool.query(
    `select * from ${tableName} where id = ?)`,
    [id]
  );
  if (beverage.length === 0) {
    return false;
  }
  return beverage;
};

/**
 * Query to get all beverages by category
 * @param {*} categoriesId category's unique id
 * @returns false if not found and beverage list if found
 */

const getBeveragesByCategory = async (categoriesId) => {
  const [beveragesByCategory] = await promisePool.query(
    `SELECT * FROM ${tableName} WHERE category = ?`,
    [categoriesId]
  );
  if (beveragesByCategory.length === 0) {
    return false;
  }
  return beveragesByCategory;
};

/**
 * Query for inserting new beverages
 * @param {*} beverage JSON of beverages information
 * @returns false if failed to create, JSON {beverageId: id} if completed
 */
const addNewBeverage = async (beverage) => {
  const { name, ingredients, tags, price, category, description } = beverage;
  sql = `INSERT INTO ${tableName} (name, ingredients, tags, price, category, description) 
        VALUES (?, ?, ?, ?, ?, ?)`;
  const params = {
    name,
    ingredients,
    tags,
    price,
    category,
    description,
  };
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { beverageId: result[0].insertId };
};

/**
 *
 * @param {*} id id of beverage wanted to update
 * @param {*} newInfo info sql of information that is wanted to upgrade.
 * Can include null values of fields that is wanted to stick as same.
 * @returns false if beverage is not found by its id or update fails,
 * if update goes through it returns JSON {beverageId: id}
 */
const modifyBeverageById = async (id, newInfo) => {
  const beverage = getOneBeverageById(id);
  if (beverage) {
    const { name, ingredients, tags, price, category, description } = beverage;
    const updateJSON = {
      name: newInfo.name ?? name,
      ingredients: newInfo.ingredients ?? ingredients,
      tags: newInfo.tags ?? tags,
      price: newInfo.price ?? price,
      category: newInfo.category ?? category,
      description: newInfo.description ?? description,
    };
    const sql = `
    UPDATE ${tableName}
    SET name = ?, ingredients = ?, tags = ?, price = ?, category = ?. description = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.name,
      updateJSON.ingredients,
      updateJSON.tags,
      updateJSON.price,
      updateJSON.category,
      updateJSON.description,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { beverageId: result[0].insertId };
  } else {
    return false;
  }
};

export {
  getAllBeverages,
  getOneBeverageById,
  getBeveragesByCategory,
  addNewBeverage,
  modifyBeverageById
};

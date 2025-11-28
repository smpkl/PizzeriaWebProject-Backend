import promisePool from "../../utils/database.js";

/**
 * Query for all categories
 * @returns all categories as a list
 */
const findAllCategories = async () => {
  return await promisePool.query(`SELECT * FROM categories`);
};

/**
 * Query for category by id
 * @param {*} id category unique id
 * @returns false if no category found, category if found
 */
const findCategoryById = async (id) => {
  const [category] = await promisePool.query(
    `SELECT * FROM categories WHERE id = ?`,
    [id]
  );
  if (category.length === 0) {
    return false;
  }
  return category[0];
};

/**
 * Query for adding new category to the database
 * @param {*} category is JSON with all necessary information
 * @returns false if it was faile to add, JSON { categoryId: result[0].insertId }
 * if added to the database
 */
const addNewCategory = async (category) => {
  const { name } = category;
  const sql = `INSERT INTO categories (name) 
               VALUES (?)`;
  const params = [name];
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { categoryId: result[0].insertId };
};

/**
 * Updates new information of category to the database
 * @param {*} id id of category wanted to update
 * @param {*} newInfo JSON with all columns info sql of information that is wanted to upgrade.
 * Can include null values of fields that are not wanted to update.
 * @returns false if category is not found by its id or update fails,
 * if update goes through it returns JSON {categoryId: id}
 */
const modifyCategoryById = async (id, newInfo) => {
  const category = await findCategoryById(id);
  if (category) {
    const { name } = category;
    const updateJSON = {
      name: newInfo.name ?? name,
    };
    const sql = `
    UPDATE categories
    SET name = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [updateJSON.name, id]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { categoryId: Number(id) };
  } else {
    return false;
  }
};

/**
 * Query for removing a category
 * @param {*} categId category unique id
 * @returns false if category could not be deleted, categoty_Id if category was deleted
 */
const removeCategory = async (categId) => {
  try {
    const result = await promisePool.execute(
      `DELETE FROM categories WHERE id = ?`,
      [categId]
    );
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { category_Id: categId };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  findAllCategories,
  findCategoryById,
  modifyCategoryById,
  addNewCategory,
  removeCategory,
};

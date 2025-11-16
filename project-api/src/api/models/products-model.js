import promisePool from "../../utils/database.js";
// files table name as variable, because name of the table might change
const tableName = "products";

/**
 * Fetch all Products and all the info from the table
 * @returns list of Products
 */
const getAllProducts = async () => {
  const [products] = await promisePool.query(`select * from ${tableName}`);
  return products;
};

/**
 * Query for Product by id
 * @param {*} id is Product id
 * @returns false if not found or Productinformation
 */

const getOneProductById = async (id) => {
  const [product] = await promisePool.query(
    `select * from ${tableName} where id = ?`,
    [id]
  );
  if (product.length === 0) {
    return false;
  }
  return product[0];
};

/**
 * Query to get all Product by category
 * @param {*} categoriesId category's unique id
 * @returns false if not found and Product list if found
 */

const getProductsByCategory = async (categoriesId) => {
  const [productsByCategory] = await promisePool.query(
    `SELECT * FROM ${tableName} WHERE category = ?`,
    [categoriesId]
  );
  if (productsByCategory.length === 0) {
    return false;
  }
  return productsByCategory;
};

/**
 * Query for inserting new Products
 * @param {*} product JSON of Products information
 * @returns false if failed to create, JSON {productId: id} if completed
 */
const addNewProduct = async (product) => {
  const { name, ingredients, price, category, description } = product;
  const sql = `INSERT INTO ${tableName} (name, ingredients, price, category, description) 
        VALUES (?, ?, ?, ?, ?)`;
  const params = [name, ingredients, price, category, description];
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { productId: result[0].insertId };
};

/**
 *
 * @param {*} id id of Product wanted to update
 * @param {*} newInfo info sql of information that is wanted to upgrade.
 * Can include null values of fields that is wanted to stick as same.
 * @returns false if Product is not found by its id or update fails,
 * if update goes through it returns JSON {productId: id}
 */
const modifyProductById = async (id, newInfo) => {
  const product = await getOneProductById(id);
  if (product) {
    const { name, ingredients, price, category, description } = product;
    const updateJSON = {
      name: newInfo.name ?? name,
      ingredients: newInfo.ingredients ?? ingredients,
      price: newInfo.price ?? price,
      category: newInfo.category ?? category,
      description: newInfo.description ?? description,
    };
    const sql = `
    UPDATE ${tableName}
    SET name = ?, ingredients = ?, price = ?, category = ?, description = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.name,
      updateJSON.ingredients,
      updateJSON.price,
      updateJSON.category,
      updateJSON.description,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { productId: id };
  } else {
    return false;
  }
};

export {
  getAllProducts,
  getOneProductById,
  getProductsByCategory,
  addNewProduct,
  modifyProductById,
};

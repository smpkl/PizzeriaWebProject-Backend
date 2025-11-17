import promisePool from "../../utils/database.js";
// files table name as variable, because name of the table might change

/**
 * Fetch all Products and all the info from the table
 * @returns list of Products
 */
const findAllProducts = async () => {
  const [products] = await promisePool.query(
    "SELECT products.*, GROUP_CONCAT(tags.title SEPARATOR ', ') AS tags FROM products LEFT JOIN products_tags ON product_id = products.id LEFT JOIN tags ON products_tags.tag_id = tags.id GROUP BY products.id;"
  );
  return products;
};

/**
 * Query for Product by id
 * @param {*} id is Product id
 * @returns false if not found or Productinformation
 */

const findOneProductById = async (id) => {
  const [product] = await promisePool.query(
    `SELECT products.*, GROUP_CONCAT(tags.title SEPARATOR ', ') AS tags FROM products LEFT JOIN products_tags ON product_id = products.id LEFT JOIN tags ON products_tags.tag_id = tags.id WHERE products.id = ? GROUP BY products.id;`,
    [id]
  );
  if (product.length === 0) {
    return false;
  }
  return product[0];
};

/**
 * Query to get all Product by category
 * @param {*} categoryId category's unique id
 * @returns false if not found and Product list if found
 */

const getProductsByCategory = async (categoryId) => {
  const [productsByCategory] = await promisePool.query(
    `SELECT products.*, GROUP_CONCAT(tags.title SEPARATOR ', ') AS tags FROM products LEFT JOIN products_tags ON product_id = products.id LEFT JOIN tags ON products_tags.tag_id = tags.id WHERE products.category = ? GROUP BY products.id;`,
    [categoryId]
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
  const sql = `INSERT INTO products (name, ingredients, price, category, description) 
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
  const product = await findOneProductById(id);
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
    UPDATE products
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

/**
 *
 * @param {*} id id of Product wanted to delete
 * @returns false if Product is not found by its id or deletion fails,
 * if deletion goes through it returns JSON {productId: id}
 */
const removeProduct = async (id) => {
  const result = await promisePool.execute(
    `DELETE FROM products WHERE id = ?`,
    [id]
  );
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { productId: id };
};

export {
  findAllProducts,
  findOneProductById,
  getProductsByCategory,
  addNewProduct,
  modifyProductById,
  removeProduct,
};

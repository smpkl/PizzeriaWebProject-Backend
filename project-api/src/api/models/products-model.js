import promisePool from "../../utils/database.js";

const findAllProducts = async () => {
  const [rows] = await promisePool.query("SELECT * FROM products");
  console.log("rows", rows);
  return rows;
};

const findProductById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

export { findAllProducts, findProductById };

import promisePool from "../../utils/database.js";
/**
 * Query for all tags
 * @returns all tags as a list
 */
const getAllTags = async () => {
  return await promisePool.query("SELECT * FROM tags");
};

/**
 * Query for tag by id
 * @param {*} id tag unique id
 * @returns false if no tag found, tag if found
 */
const getOneTagById = async (id) => {
  const [tag] = await promisePool.query(`SELECT * FROM tags WHERE ID = ?)`, [
    id,
  ]);
  if (tag.length === 0) {
    return false;
  }
  return tag;
};

import promisePool from "../../utils/database.js";
/**
 * Query for all tags
 * @returns all tags as a list
 */
const getAllTags = async () => {
  const [tags] = await promisePool.query("SELECT * FROM tags");
  return tags;
};

/**
 * Query for tag by id
 * @param {*} id tag unique id
 * @returns false if no tag found, tag if found
 */
const getOneTagById = async (id) => {
  const [tag] = await promisePool.execute(`SELECT * FROM tags WHERE id = ?`, [
    Number(id),
  ]);
  if (tag.length === 0) {
    return false;
  }
  return tag[0];
};

/**
 * Query for adding a new tag
 * @param {*} tagInfo the data to be added to the Database
 * @returns false if tag could not be added, tagId if a new tag was added
 */
const addNewTag = async (tagInfo) => {
  const { title, color_hex, icon } = tagInfo;
  const result = await promisePool.query(
    `INSERT INTO tags (title, color_hex, icon) VALUES (?, ?, ?)`,
    [title, color_hex, icon]
  );
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { tagId: result[0].insertId };
};

/**
 * Query for removing a tag
 * @param {*} tagId tag unique id
 * @returns false if tag could not be deleted, tagId if a tag was deleted
 */
const removeTag = async (tagId) => {
  console.log(tagId);
  try {
    const result = await promisePool.execute(`DELETE FROM tags WHERE id = ?`, [
      tagId,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { tagId: tagId };
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 *
 * @param {*} id id of tag wanted to update
 * @param {*} newInfo info sql of information that is wanted to upgrade.
 * Can include null values of fields that is wanted to stick as same.
 * @returns false if tag is not found by its id or update fails,
 * if update goes through it returns JSON {tagId: id}
 */
const updateTag = async (id, newInfo) => {
  const [tag] = await getOneTagById(id);
  if (tag) {
    const { title, color_hex, icon } = tag;
    const updateJSON = {
      title: newInfo.title ?? title,
      color_hex: newInfo.color_hex ?? color_hex,
      icon: newInfo.icon ?? icon,
    };
    const sql = `
    UPDATE tags
    SET title = ?, color_hex = ?, icon = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.title,
      updateJSON.color_hex,
      updateJSON.icon,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { tagId: id };
  } else {
    return false;
  }
};

export { getAllTags, getOneTagById, addNewTag, removeTag, updateTag };

import promisePool from "../../utils/database.js";
/**
 * Query for all announcements
 * @returns all announcements as a list
 */
const findAllAnnouncements = async () => {
  return await promisePool.query("SELECT * FROM announcements");
};

/**
 * Query for announcement by id
 * @param {*} id announcement unique id
 * @returns false if no announcement found, announcement if found
 */
const findAnnouncementById = async (id) => {
  const [announcement] = await promisePool.query(
    `SELECT * FROM announcements WHERE ID = ?`,
    [id]
  );
  if (announcement.length === 0) {
    return false;
  }
  return announcement;
};
/**
 * Query for adding new announcement to the database
 * @param {*} announcement is JSON with all necessary information
 * @returns false if it was faile to add, JSON { announcementId: result[0].insertId }
 * if added to the database
 */
const addNewAnnouncement = async (announcement) => {
  const { title, text, filename } = announcement;
  const sql = `INSERT INTO announcements (title, text, filename) 
               VALUES (?, ?, ?)`;
  const params = [title, text, filename ?? null];
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { announcementId: result[0].insertId };
};

/**
 * Updates new information of announcement to the database
 * @param {*} id id of announcement wanted to update
 * @param {*} newInfo JSON with all columns info sql of information that is wanted to upgrade.
 * Can include null values of fields that are not wanted to update.
 * @returns false if announcement is not found by its id or update fails,
 * if update goes through it returns JSON {announcementId: id}
 */
const modifyAnnouncementById = async (id, newInfo) => {
  const announcement = await findAnnouncementById(id);
  if (announcement) {
    const { title, text, filename } = announcement[0];
    const updateJSON = {
      title: newInfo.title ?? title,
      text: newInfo.text ?? text,
      filename: newInfo.filename ?? filename,
    };
    const sql = `
    UPDATE announcements
    SET title = ?, text = ?, filename = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.title,
      updateJSON.text,
      updateJSON.filename,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { announcementId: id };
  } else {
    return false;
  }
};

/**
 *
 * @param {*} id id of Announcement wanted to delete
 * @returns false if Announcement is not found by its id or deletion fails,
 * if deletion goes through it returns JSON {announcementId: id}
 */
const removeAnnouncement = async (id) => {
  const result = await promisePool.execute(
    `DELETE FROM announcements WHERE id = ?`,
    [id]
  );
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { announcementId: id };
};

export {
  findAllAnnouncements,
  findAnnouncementById,
  modifyAnnouncementById,
  addNewAnnouncement,
  removeAnnouncement,
};

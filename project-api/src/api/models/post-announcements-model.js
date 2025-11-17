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
    `SELECT * FROM announcements WHERE ID = ?)`,
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
  const { title, text, image } = announcement;
  const sql = `INSERT INTO announcements (title, text, image) 
               VALUES (?, ?, ?)`;
  const params = [title, text, image ?? ""];
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { announcementId: result[0].insertId };
};

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
  addNewAnnouncement,
  removeAnnouncement,
};

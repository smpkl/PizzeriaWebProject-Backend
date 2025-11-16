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

export { findAllAnnouncements, findAnnouncementById };

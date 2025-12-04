import promisePool from "../../utils/database.js";

/**
 * Fetch all locations and all the info from the table
 * @returns list of locations
 */
const findAllLocations = async () => {
  const [locations] = await promisePool.query("SELECT * FROM locations;");
  return locations;
};

/**
 * Query for location by id
 * @param {*} id unique id of the location
 * @returns false if not found or location info if found
 */
const findLocationById = async (id) => {
  const [location] = await promisePool.query(
    `SELECT * FROM locations WHERE id = ?`,
    [id]
  );
  console.log(location);
  if (location.length === 0) {
    return false;
  }
  return location[0];
};

export { findAllLocations, findLocationById };

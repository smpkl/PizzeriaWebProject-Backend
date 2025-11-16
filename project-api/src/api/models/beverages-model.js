import promisePool from "../../utils/database.js";
// files table name as variable, because name of the table might change
const tableName = "foods";

/**
 * Fetch all beverages and all the info from the table
 * @returns list of beverages
 */
const getAllBeverages = async () => {
    const [beverages] = await promisePool.query(`select * from ?`, [tableName])
    return beverages;
}

/**
 * Query for beverage/food by id
 * @param {*} id is beverage/foods id
 * @returns false if not found or beverage information
 */

const getOneBeverageById = async (id) => {
    const [beverage] = await promisePool.query(`select * from ? where id = ?)`, [tableName, id])
    if (beverage.length === 0) {
        return false;
    }
    return beverage;
}


import promisePool from "../../utils/database.js";

/**
 * Query for getting all users
 * @returns all current users
 */
const findAllUsers = async () => {
  const [users] = await promisePool.query(`SELECT * FROM users`);
  return users;
};

/**
 * Query for user by id
 * @param {*} id user id
 * @returns false if no user found, user if found
 */
const findOneUserById = async (id) => {
  const [user] = await promisePool.query(
    `SELECT id, first_name, last_name, email, address, role FROM users WHERE id = ?`,
    [id]
  );
  if (user.length === 0) {
    return false;
  }
  return user[0];
};

/**
 * Query for user by email
 * @param {*} email user email
 * @returns false if no user found, user if found
 */
const findOneUserByEmail = async (email) => {
  const [user] = await promisePool.query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  if (user.length === 0) {
    return false;
  }
  return user[0];
};

/**
 * Query for adding new user to the database
 * @param {*} user is JSON with all necessary informatiom
 * @returns false if it was failed to add, JSON { user_id: rows[0].insertId }
 * if added to the database
 */
const addNewUser = async (user) => {
  const { first_name, last_name, email, password, address, role } = user;
  const sql = `INSERT INTO users (first_name, last_name, email, password, address, role)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [first_name, last_name, email, password, address, role];
  const rows = await promisePool.execute(sql, params);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { user_id: rows[0].insertId };
};

/**
 * Updates new information to the database
 * @param {*} id id of user wanted to update
 * @param {*} newInfo JSON with all columns info sql of information that is wanted to upgrade.
 * Can include null values of fields that is wanted to stick as same.
 * @returns false if user is not found by its id or update fails,
 * if update goes through it returns JSON {user_id: id}
 */
const modifyUserById = async (id, newInfo) => {
  const user = await findOneUserById(id);
  if (user) {
    const { first_name, last_name, email, password, address } = user;
    const updateJSON = {
      first_name: newInfo.first_name ?? first_name,
      last_name: newInfo.last_name ?? last_name,
      email: newInfo.email ?? email,
      password: newInfo.password ?? password,
      address: newInfo.address ?? address,
    };
    const sql = `
    UPDATE users
    SET first_name = ?, last_name = ?, email = ?, password = ?, address = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.first_name,
      updateJSON.last_name,
      updateJSON.email,
      updateJSON.password,
      updateJSON.address,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { user_id: id };
  } else {
    return false;
  }
};

/**
 * Query for removing a user
 * @param {*} id user unique id
 * @returns false if user could not be deleted, user_id if user was deleted
 */
const removeUser = async (id) => {
  try {
    const result = await promisePool.execute(`DELETE FROM users WHERE id = ?`, [
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { user_id: id };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  findAllUsers,
  findOneUserById,
  findOneUserByEmail,
  addNewUser,
  modifyUserById,
  removeUser,
};

import mysql from "mysql2";
//TODO: add dotenv/config with corrcet environmental variables
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const promisePool = pool.promise();

const closePool = async () => {
  await promisePool.end();
};

export default promisePool;
export { closePool };

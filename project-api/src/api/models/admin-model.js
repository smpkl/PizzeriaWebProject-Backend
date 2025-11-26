/* const findAdminByLastnameAndFirstname = async (last_name, first_name) => {
  console.log(last_name, first_name);
  const [rows] = await promisePool.execute(
    "SELECT * FROM admins WHERE last_name = ? AND first_name = ?",
    [last_name, first_name]
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
}; */

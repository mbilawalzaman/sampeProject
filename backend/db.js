import mysql from "mysql2/promise"; // Import MySQL2 with promises

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Use your password
  database: "myapp_db",
});

export default db;

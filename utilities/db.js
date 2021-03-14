const mysql = require('mysql2/promise');



async function query(sql, params) {
try {
    const config = {
        db: { 
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }
      };
    const connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.execute(sql, params);

  return results;
} catch (error) {
    console.log("error in db connection: ",error);
}
  
}

module.exports = {
  query
}
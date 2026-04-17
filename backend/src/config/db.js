const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const sqliteSchema = require('./sqliteSchema');
require('dotenv').config();

let dbInstance = null;

async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    // Create tables on startup
    await dbInstance.exec(sqliteSchema);
  }
  return dbInstance;
}

// Polyfill to match the mysql2 'execute' method signature
const pool = {
  execute: async (sql, params = []) => {
    const db = await getDb();
    
    // Convert ? to SQLite parameters if needed (they use the same ? syntax)
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await db.all(sql, params);
      return [rows]; // Return tuple matching mysql2: [rows, fields]
    } else {
      const result = await db.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    }
  }
};

module.exports = pool;
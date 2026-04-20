import { query } from './config/db.js';

export const db = {
  prepare: (sql) => ({
    run: async (...params) => {
      const res = await query(sql, params);
      return { lastInsertRowid: res.insertId, affectedRows: res.rowCount };
    },
    get: async (...params) => {
      const res = await query(sql, params);
      return res.rows[0] || null;
    },
    all: async (...params) => {
      const res = await query(sql, params);
      return res.rows || [];
    }
  })
};

export default db;
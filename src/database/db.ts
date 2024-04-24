import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./src/database/todo.db', (err) => {
  if (err) {
    console.error(`Error opening database ${err.message}`);
  } else {
    db.run(
      'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN DEFAULT 0)',
      (err) => {
        if (err) {
          console.error(`Error creating table ${err.message}`);
        }
      },
    );
  }
});

export default db;

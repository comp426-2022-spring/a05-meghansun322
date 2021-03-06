"use strict";
// require better-sqlite
const Database = require("better-sqlite3");
// connect to a database or create one if it doesn't exist yet
const db = new Database("./data/db/log.db");
// Is the database initialized or do we need to intnialize it?
const stmt = db.prepare(
  `SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`
);
let row = stmt.get();
console.log(row);
if (!row) {
  // echo information about what you are doing to the console.
  console.log("Your database appears to be empty. I will intialize it now.");
  // set a const that will contain your SQL commands to intilize the databse.
  const sqlInit = `
  CREATE TABLE accesslog ( 
      id INTEGER PRIMARY KEY, 
      remoteaddr TEXT,
      remoteuser TEXT,
      time TEXT,
      method TEXT,
      url TEXT,
      protocol TEXT,
      httpversion TEXT,
      status TEXT, 
      referrer TEXT,
      useragent TEXT
  );
`;
  // Execute SQL commands that we just wrote above
  db.exec(sqlInit);
  // Echo information about what we just did to the console
  console.log(
    "Your database has been intilaized with a new table and two entries have been added"
  );
} else {
  // Since the database already exists, scho that ot ehco that to the console.
  console.log("Database exists.");
}
// Export all of the above as module so that we can use it elsewhere.
module.exports = db;

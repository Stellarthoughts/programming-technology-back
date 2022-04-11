let sqlite3 = require('sqlite3').verbose()

const DBSOURCE = 'sqlite.db'

let db = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
		console.error(err.message);
		throw err;
	} else {
		console.log('Connected to the SQLite database.')
		db.run(`CREATE TABLE IF NOT EXISTS user (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name text, 
			email text UNIQUE, 
			password text, 
			CONSTRAINT email_unique UNIQUE (email)
		)`);
	}
});

module.exports = db
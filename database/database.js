let sqlite3 = require('sqlite3').verbose()

const DBSOURCE = 'db.sqlite'

let db = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
		console.error(err.message);
		throw err;
	} else {
		console.log('Connected to the SQLite database.')
		db.run(`CREATE TABLE user (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name text, 
			email text UNIQUE, 
			password text, 
			CONSTRAINT email_unique UNIQUE (email)
		)`,
		(err) => {
			if (err) {
				// Table already created
			} else {
				// Table just created, creating some rows
				let insert = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`
				db.run(insert, ["admin", "admin@example.com", "admin123456"])
				db.run(insert, ["user", "user@example.com", "user123456"])
			}
		});
	}
});

module.exports = db
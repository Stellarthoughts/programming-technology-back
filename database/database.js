let sqlite3 = require('sqlite3').verbose()

const DBSOURCE = 'sqlite.db'

let db = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
		console.error(err.message);
		throw err;
	} else {
		console.log('Connected to the SQLite database.')
		db.serialize(() => {
			db.run(`CREATE TABLE IF NOT EXISTS user (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				login text, 
				email text UNIQUE, 
				password text,  
				life_time_tasks INTEGER NOT NULL DEFAULT 0,
				tasks_done INTEGER NOT NULL DEFAULT 0,
				CONSTRAINT email_unique UNIQUE (email)
			)`);
			db.run(`CREATE TABLE IF NOT EXISTS task (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				content text,
				done INTEGER NOT NULL DEFAULT 0,
				userid INTEGER NOT NULL,
				FOREIGN KEY (userid) REFERENCES user(id)
				)`);
			db.run(`CREATE TABLE IF NOT EXISTS achievement (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name text NOT NULL, 
				content text,
				userid INTEGER,
				is_new INTEGER NOT NULL DEFAULT 1,
				type text NOT NULL DEFAULT 'default',
				FOREIGN KEY (userid) REFERENCES user(id)
				)`);
		});
	}
});

module.exports = db
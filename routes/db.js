const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('test.db')
let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
	db.serialize(() => {
		let last;
		//const full = db.prepare('SELECT rowid as ID FROM user');

		const stmt = db.prepare('INSERT INTO user (login, password) VALUES (@login, @password)')
		for (let i = 0; i < 10; i++) {
			stmt.run(`Guy ${i}`,`${(Math.random() + 1).toString(36).substring(7)}`)
		}
		stmt.finalize()

		/*db.each('SELECT userid, login, password FROM user', (err, row) => {
			console.log(`${row.userid}: ${row.login}: ${row.password}`)
		})*/
	})

	db.close();
	res.send({express: 'DB SOMETHING'});
});

module.exports = router;
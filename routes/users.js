let express = require('express');
let router = express.Router();
let db = require('./../database/database')
let bodyParser = require("body-parser")
let jsonParser = bodyParser.json()

/* GET users listing. */
router.get('/', (req, res, next) => {
  let sqlQuery = 'SELECT * FROM user'
	let params = []

	db.all(sqlQuery, params, (err, rows) => {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		res.json({
			"message": "success",
			"data": rows
		});
	});
});

/* GET authorization by nickname and password */
router.get('/:login&:password', (req, res, next) => {
	let sqlQuery = 'SELECT id, login FROM user WHERE login = ? AND password = ?'
	let params = [req.params.login, req.params.password]

	db.get(sqlQuery, params, function (err, row) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		if (!row) {
			res.json({
				"message": "failure",
				"description": "Wrong login or password"
			});
		} else {
			res.json({
				"message": "success",
				"data": row
			});
		}
	});
});

/* POST (create) user */
router.post("/", jsonParser, (req, res, next) => {
	let data = {
		login: req.body.login,
		email: req.body.email,
		password: req.body.password
	}

	let sqlQuery = `INSERT INTO user (login, email, password) VALUES (?, ?, ?)`
	let params = [data.login, data.email, data.password]

	db.run(sqlQuery, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		res.json({
			"message": "success",
			"login": data.login,
			"id": this.lastID,
		})
	});
});

/* DELETE user by id */
router.delete("/:id", (req, res, next) => {
	let sqlQuery = "DELETE FROM user WHERE id = ?"
	let params = [req.params.id]

	db.run(sqlQuery, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		res.json({
			"message": "deleted",
			"changes": this.changes
		})
	})
});

module.exports = router;

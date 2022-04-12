let express = require('express');
let router = express.Router();
let db = require('./../database/database')
let bodyParser = require("body-parser")
let jsonParser = bodyParser.json()

/* GET users listing. */
router.get('/', (req, res, next) => {
  let sqlQuerry = 'SELECT * from user'
	let params = []

	db.all(sqlQuerry, params, (err, rows) => {
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
router.get('/:nickname&:password', (req, res, next) => {
	let sqlQuerry = 'SELECT * FROM user WHERE nickname = ? AND password = ?'
	let params = [req.params.nickname, req.params.password]

	db.get(sqlQuerry, params, function (err, row) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		if (!row) {
			res.json({
				"message": "failure"
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
		nickname: req.body.nickname,
		email: req.body.email,
		password: req.body.password
	}

	let sqlQuerry = `INSERT INTO user (nickname, email, password) VALUES (?, ?, ?)`
	let params = [data.nickname, data.email, data.password]

	db.run(sqlQuerry, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		res.json({
			"message": "success",
			"data": data,
			"id": this.lastID,
		})
	});
});

/* DELETE user by id */
router.delete("/:id", (req, res, next) => {
	let sqlQuerry = "DELETE FROM user WHERE id = ?"
	let params = [req.params.id]

	db.run(sqlQuerry, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		res.json({"message": "deleted", changes: this.changes})
	})
});

module.exports = router;

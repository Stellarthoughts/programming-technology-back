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

/* GET user by id */
router.get('/:id', (req, res, next) => {
	let sqlQuerry = 'SELECT * from user WHERE id = ?'
	let params = [req.params.id]

	db.get(sqlQuerry, params, (err, row) => {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		res.json({
			"message": "success",
			"data": row
		});
	});
});

/* POST (create) user */
router.post("/", jsonParser, (req, res, next) => {
	let data = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	}

	let sqlQuerry = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`
	let params = [data.name, data.email, data.password]

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

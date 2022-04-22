let express = require('express');
let router = express.Router();
let db = require('../database/database')
let bodyParser = require("body-parser")
let jsonParser = bodyParser.json()

/* POST (create) achievement */
router.post("/", jsonParser, (req, res, next) => {
	let data = {
		name: req.body.name,
		content: req.body.content,
		status: req.body.status,
	}

	let sqlQuerrry = `INSERT INTO achievement (name, content, status) VALUES (?, ?, ? )`;
	let params = [data.name, data.content, date.status];

	db.run(sqlQuerrry, params, function (err, result) {
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

/* POST (create) achievement for particular user*/
router.post("/", jsonParser, (req, res, next) => {
	let data = {
		name: req.body.name,
		content: req.body.content,
		status: req.body.status,
		userid: req.body.userid,
	}

	let sqlQuerrry = `INSERT INTO achievement (name, content, status, userid) VALUES (?, ?, ?, ?)`;
	let params = [data.name, data.content, date.status, data.userid];

	db.run(sqlQuerrry, params, function (err, result) {
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

/* PUT (update) achievement */
router.put("/", jsonParser, (req, res, next) => {
	let data = {
		name: req.body.name,
		content: req.body.content,
		status: req.body.status,
		userid: req.body.userid,
		id: req.body.id
	};

	let sqlQuerrry = `UPDATE achievement SET name = ?, content = ?, status = ? WHERE userid = ?`;
	let params = [data.name, data.content, date.status, data.userid, data.id];

	db.run(sqlQuerrry, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		res.json({
			"message": "success",
			"data": data,
		})
	});
});

/* DELETE achievement by userid */
router.delete("/:userid", (req, res, next) => {
	let sqlQuerrry = "DELETE FROM achievement WHERE userid = ?"
	let params = [req.params.userid]

	db.run(sqlQuerrry, params, function (err, result) {
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

/* DELETE achievement by id */
router.delete("/:id", (req, res, next) => {
	let sqlQuerrry = "DELETE FROM achievement WHERE id = ?"
	let params = [req.params.id]

	db.run(sqlQuerrry, params, function (err, result) {
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

/* GET all achievements */
router.get('/', (req, res, next) => {
	let sqlQuerrry = 'SELECT * from achievement'
	let params = []

	db.all(sqlQuerrry, params, (err, rows) => {
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

/* GET all achievements for particular user. */
router.get('/:userid', (req, res, next) => {
	let sqlQuerrry = 'SELECT * from achievement WHERE userid = ?'
	let params = [req.params.userid]

	db.all(sqlQuerrry, params, (err, rows) => {
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

module.exports = router;
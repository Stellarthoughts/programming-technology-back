let express = require('express');
let router = express.Router();
let db = require('./../database/database')
let bodyParser = require("body-parser")
let jsonParser = bodyParser.json()

router.get('/', (req, res, next) => {
	let sqlQuerry = 'SELECT * from task'
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

/* GET all tasks for particular user. */
router.get('/:userid', (req, res, next) => {
	let sqlQuerry = 'SELECT * from task WHERE userid = ?'
	let params = [req.params.userid]

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

/* POST (create) task */
router.post("/", jsonParser, (req, res, next) => {
	let data = {
		name: req.body.name,
		content: req.body.content,
		userid: req.body.userid,
	}

	// Update or Insert? Регулируется параметром mode, передаваемые в запросе.
	// Id передается в случае UPDATE.
	// let mode = req.body.mode != null ? req.body.mode : 'INSERT';
	// let id = req.body.id != null ? req.body.id : 0;

	let sqlQuerry = `INSERT INTO task (name, content, userid) VALUES (?, ?, ?)`;
	let params = [data.name, data.content, data.userid];

	// switch(mode)
	// {
	// 	case 'INSERT':
	// 		sqlQuerry = `INSERT INTO task (name, content, userid) VALUES (?, ?, ?)`
	// 		params = [data.name, data.content, data.userid]
	// 		break;
	// 	case 'UPDATE':
	// 		sqlQuerry = 'UPDATE task SET name = ?, content = ?, userid = ? WHERE id = ?'
	// 		params = [data.name, data.content, data.userid, id]
	// 		break;
	// }

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

/* PUT (update) task */
router.put("/", jsonParser, (req, res, next) => {
	let data = {
		name: req.body.name,
		content: req.body.content,
		userid: req.body.userid,
		id: req.body.id
	};

	let sqlQuery = `UPDATE task SET name = ?, content = ?, userid = ? WHERE id = ?`;
	let params = [data.name, data.content, data.userid, data.id];

	db.run(sqlQuery, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		res.json({
			"message": "success",
			"data": data,
			// "id": this.lastID,
		})
	});
});

/* DELETE task by id */
router.delete("/:id", (req, res, next) => {
	let sqlQuerry = "DELETE FROM task WHERE id = ?"
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

let express = require('express');
let router = express.Router();
let db = require('./../database/database')
let bodyParser = require("body-parser")
let jsonParser = bodyParser.json()
let AS = require('./../system/achievements/achievementSystem')

/* GET all tasks */
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
		content: req.body.content,
		userid: req.body.userid,
		id: 0
	}

	let sqlQuerry = `INSERT INTO task (content, userid) VALUES (?, ?)`;
	let params = [data.content, data.userid];

	db.run(sqlQuerry, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		data.id = this.lastID;
		AS.UserCreatedNewTask(data.userid);

		res.json({
			"message": "success",
			"data": data,
		})
	});
});

/* PUT (update) task */
router.put("/", jsonParser, (req, res, next) => {
	let data = {
		content: req.body.content,
		done: req.body.done,
		userid: req.body.userid,
		id: req.body.id
	};

	let sqlQuery = `UPDATE task SET content = ?, done = ?, userid = ? WHERE id = ?`;
	let params = [data.content, data.done, data.userid, data.id];

	db.run(sqlQuery, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		AS.UserChangedStatusOfTask(data.userid,data.done);

		res.json({
			"message": "success",
			"data": data,
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

		res.json({
			"message": "deleted", 
			"changes": this.changes
		})
	})
});

module.exports = router;

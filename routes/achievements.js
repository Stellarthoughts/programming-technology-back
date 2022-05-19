let express = require('express');
let router = express.Router();
let db = require('../database/database')
let bodyParser = require("body-parser")
let jsonParser = bodyParser.json()
let AS = require('./../system/achievements/achievementSystem')

/* POST (create) achievement for particular user*/
router.post("/", jsonParser, (req, res, next) => {
	let data = {
		name: req.body.name,
		content: req.body.content,
		status: req.body.status,
		userid: req.body.userid,
		id: 0
	}

	let sqlQuerrry = `INSERT INTO achievement (name, content, status, userid) VALUES (?, ?, ?, ?)`;
	let params = [data.name, data.content, data.status, data.userid];

	db.run(sqlQuerrry, params, function (err, result) {
		if (err) {
			res.status(400).json({"error": err.message})
			return;
		}

		data.id = this.lastID;

		res.json({
			"message": "success",
			"data": data,
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

	let sqlQuerrry = `UPDATE achievement SET name = ?, content = ?, status = ?, userid = ? WHERE id = ?`;
	let params = [data.name, data.content, data.status, data.userid, data.id];

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
/*router.delete("/:userid", (req, res, next) => {
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
});*/

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

/* GET new achievements for particular user */
router.get('/new/:userid', async (req, res, next) => {
	let newAchievements = await AS.ReturnNewAchievements(req.params.userid);
	res.json({
		"message":"success",
		"data": newAchievements
	});
});


module.exports = router;
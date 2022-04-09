const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('test.db')
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	db.serialize(() => {
		var qres = db.run('SELECT userid, login, password FROM user');
		//res.render(ByteLengthQueuingStrategy);
	})
});

module.exports = router;
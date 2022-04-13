var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
		"message": "success",
		"express": "YOUR EXPRESS BACKEND IS CONNECTED TO REACT"
	});
});

module.exports = router;

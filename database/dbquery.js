let db = require('./database')

let x = function db_all(query, params){
	return new Promise(function(resolve,reject){
			db.all(query, params, function(err,rows){
				 if(err){return reject(err);}
				 resolve(rows);
			 });
	});
}

module.exports = x;
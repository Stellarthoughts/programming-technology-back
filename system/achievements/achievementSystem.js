const db = require('../../database/database');
const types = require('./achievementTypes');

class AchievementSystem {

	constructor() {}

	async UserCreatedNewTask (userid) {
		let object = this;

		db.all('SELECT life_time_tasks FROM user WHERE id = ?',[userid], async function(err, result) {
			if(err != null || result.length === 0)
				return;
			
			let newValue = result[0].life_time_tasks + 1;

			if(newValue >= 10 && await object.CheckUserDoesntHaveAchievement(userid, types.C_10_TASKS))
			{
				object.UserNewAchievement(userid, types.C_10_TASKS);
			}
			if(newValue >= 20 && await object.CheckUserDoesntHaveAchievement(userid, types.C_20_TASKS))
			{
				object.UserNewAchievement(userid, types.C_20_TASKS);
			}
			if(newValue >= 30 && await object.CheckUserDoesntHaveAchievement(userid, types.C_30_TASKS))
			{
				object.UserNewAchievement(userid, types.C_30_TASKS);
			}

			db.run('UPDATE user SET life_time_tasks = ? WHERE id = ?',[newValue, userid]);
		})
	}

	async UserChangedStatusOfTask (userid, status) {
		let object = this;

		db.all('SELECT tasks_done FROM user WHERE id = ?',[userid], async function(err, result) {
			if(err != null || result.length === 0)
				return;

			let newValue = result[0].tasks_done + (status == true ? 1 : -1);			

			if(newValue >= 5 && await object.CheckUserDoesntHaveAchievement(userid, types.D_5_TASKS))
			{
				object.UserNewAchievement(userid, types.D_5_TASKS);
			}
			if(newValue >= 10 && await object.CheckUserDoesntHaveAchievement(userid, types.D_10_TASKS))
			{
				object.UserNewAchievement(userid, types.D_10_TASKS);
			}
			if(newValue >= 15 && await object.CheckUserDoesntHaveAchievement(userid, types.D_15_TASKS))
			{
				object.UserNewAchievement(userid, types.D_15_TASKS);
			}

			db.run('UPDATE user SET tasks_done = ? WHERE id = ?',[newValue, userid]);
		})
		
	}

	async CheckUserDoesntHaveAchievement (userid, type) {
		let res = await this.db_all('SELECT * FROM achievement WHERE userid = ? AND type = ?',[userid, type.type]);
		if(res.length === 0)
			return true;
		else 
			return false;
	}

	UserNewAchievement (userid, type) {
		db.run('INSERT INTO achievement (name, content, is_new, userid, type) VALUES (?, ?, ?, ?, ?)'
		,[type.name,type.content,1,userid,type.type])
	}

	async CheckAchiementsAsOld (toNotify) {
		if(toNotify === null)
			return;
		if(toNotify.length === 0)
			return;
		toNotify.forEach(element => {
			let sqlQuery = `UPDATE achievement SET is_new = 0 WHERE id = ?`;
			let params = [element.id];
			db.run(sqlQuery, params);
		});
	}

	async ReturnNewAchievements (userid) {
		let newAchievements = await this.db_all('SELECT * FROM achievement WHERE userid = ? AND is_new = ?',[userid,1]);
		this.CheckAchiementsAsOld(newAchievements);
		return newAchievements;
	}

	async db_all(query, params){
    return new Promise(function(resolve,reject){
        db.all(query, params, function(err,rows){
           if(err){return reject(err);}
           resolve(rows);
         });
    });
	}
}

let sys = new AchievementSystem();

module.exports = sys;
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let sqlite3 = require('sqlite3').verbose()
let bodyParser = require('body-parser')

let db = new sqlite3.Database('test.db')

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let dataRouter = require('./routes/data');
let dbRouter = require('./routes/db');

let dbGetUsersRouter = require('./routes/db_get_users');

let app = express();

// db start up
db.serialize(() => {
	db.run('CREATE TABLE IF NOT EXISTS user (userid INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT NOT NULL, password TEXT)')
	db.run('CREATE TABLE IF NOT EXISTS task (taskid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, content TEXT, userid INTEGER NOT NULL)')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/express_backend', dataRouter);
app.use('/db_test', dbRouter);
app.use('/db_get_users', dbGetUsersRouter);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// shutdown
app.on('exit',function() {
	db.close();
});

module.exports = app;

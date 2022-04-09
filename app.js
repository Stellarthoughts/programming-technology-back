var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose()

var db = new sqlite3.Database('test.db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');
var dbRouter = require('./routes/db');

var dbGetUsersRouter = require('./routes/db_get_users');

var app = express();

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

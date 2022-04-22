let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let db = require('./database/database');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let dataRouter = require('./routes/data');
let tasksRouter = require('./routes/tasks');
let achievementRouter = require('./routes/achievement');

let app = express();

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
app.use('/tasks',tasksRouter);
app.use('/achievement', achievementRouter);

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

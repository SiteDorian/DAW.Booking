var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var homeRouter = require("./routes/homeRouter");

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

var app = express();

const accessTokenSecret = 'youraccesstokensecret';

const users = [
  {
    username: 'admin',
    password: 'password',
    role: 'admin'
  }, {
    username: 'member',
    password: 'password',
    role: 'member'
  }
];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', (req, res) => {
  console.log('login api call')
  // Read username and password from request body
  const { username, password } = req.body;

  // Filter user from the users array by username and password
  const user = users.find(u => { return u.username === username && u.password === password });

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret);

    res.json({
      accessToken
    });
  } else {
    res.send('Username or password incorrect');
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', homeRouter);
app.use('/testAPI', testAPIRouter);


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


module.exports = app;

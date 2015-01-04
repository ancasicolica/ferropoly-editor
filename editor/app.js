var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var login = require('./routes/login');
var configuration = require('./routes/configuration');
var settings = require('./settings');
var app = express();

var initServer = function () {
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  login.init(app, settings);
  app.use('/', routes);


  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  //server.listen(3001);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  io.on('connection', function (socket) {
    // Initialize locations for listening to the socket.io events
    locations.addSocket(socket);
  });

  app.set('port', settings.server.port);
  app.set('ip', settings.server.host);
  server.listen(app.get('port'), app.get('ip'), function() {
    console.log('%s: Node server started on %s:%d ...',
      Date(Date.now() ), app.get('ip'), app.get('port'));
  });
  console.log('Ferropoly Editor server listening on port ' + app.get('port'));
};

initServer();


module.exports = app;

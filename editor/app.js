/**
 * FERROPOLY GAME EDITOR APP
 *
 * (c) 2015 Christian Kuster, CH-8342 Wernetshausen
 *
 * @type {*|exports}
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var useradmin = require('./routes/useradmin');
var edit = require('./routes/edit');
var newgame = require('./routes/newgame');
var gameplay = require('./routes/gameplay');
var authtoken = require('./routes/authtoken');
var configuration = require('./routes/configuration');
var settings = require('./settings');
var authStrategy = require('../common/lib/authStrategy');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();
var users = require('../common/models/userModel');
var gameplays = require('../common/models/gameplayModel');
var properties = require('../common/models/propertyModel');
var locations = require('../common/models/locationModel');
var ferropolyDb = require('../common/lib/ferropolyDb');
var pricelist = require('./routes/pricelist');
var player = require('./routes/player');
var initServer = function () {
  authStrategy.init(settings, users);

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

  // Define Strategy, login
  passport.use(authStrategy.strategy);
  // Session serializing of the user
  passport.serializeUser(authStrategy.serializeUser);
  // Session deserialisation of the user
  passport.deserializeUser(authStrategy.deserializeUser);
  // required for passport: configuration
  app.use(session({secret: 'ferropolyIsAGameWithAVeryLargePlayground'})); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session


  signup.init(app, users);
  login.init(app, settings);
  authtoken.init(app);
  useradmin.init(app, settings, users);

  app.use('/', routes);
  newgame.init(app);
  edit.init(app, gameplays, users, properties);
  gameplay.init(app);
  configuration.init(app, settings);
  app.use('/pricelist', pricelist);
  app.use('/player', player);

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
    console.log('socket.io connection');
    signup.onSocketConnection(socket);
  });

  app.set('port', settings.server.port);
  app.set('ip', settings.server.host);
  server.listen(app.get('port'), app.get('ip'), function() {
    console.log('%s: Node server started on %s:%d ...',
      Date(Date.now() ), app.get('ip'), app.get('port'));
  });
  console.log('Ferropoly Editor server listening on port ' + app.get('port'));
};

/**
 * Initialize DB connection, has to be only once for all models
 */
ferropolyDb.init(settings, function(err) {
  if (err) {
    console.log('Failed to init ferropolyDb');
    console.error(err);
  }
  initServer();

});


module.exports = app;

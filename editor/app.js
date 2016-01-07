/**
 * FERROPOLY GAME EDITOR APP
 *
 * (c) 2015 Christian Kuster, CH-8342 Wernetshausen
 *
 * @type {*|exports}
 */
var express = require('express');
var path    = require('path');
//var favicon = require('serve-favicon');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var routes        = require('./routes/index');
var login         = require('./routes/login');
var signup        = require('./routes/signup');
var useradmin     = require('./routes/useradmin');
var edit          = require('./routes/edit');
var newgame       = require('./routes/newgame');
var gameplay      = require('./routes/gameplay');
var authtoken     = require('./routes/authtoken');
var issuetracker  = require('./routes/issuetracker');
var configuration = require('./routes/configuration');
var infoRoute     = require('../common/routes/info');
var settings      = require('./settings');
var passport      = require('passport');
var session       = require('express-session');
var flash         = require('connect-flash');
var app           = express();
var users         = require('../common/models/userModel');
var gameplays     = require('../common/models/gameplayModel');
var properties    = require('../common/models/propertyModel');
var ferropolyDb   = require('../common/lib/ferropolyDb');
var pricelist     = require('./routes/pricelist');
var cronjobs      = require('./lib/cronjobs');
var logger        = require('../common/lib/logger').getLogger('editor-app');
var winston       = require('winston');
var mailer        = require('../common/lib/mailer');
var logs          = require('../common/models/logModel');
var morgan        = require('morgan');
var moment        = require('moment');
var compression   = require('compression');
var authStrategy  = require('../common/lib/authStrategy')(settings, users);
var demoUsers     = require('./lib/demoUsers');
var initServer    = function () {
  cronjobs.init();
  mailer.init(settings);
  logs.init(settings);

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  morgan.token('prefix', function getId(req) {
    return 'http: ' + moment().format();
  });
  app.use(morgan(':prefix :method :status :remote-addr :url'));

  // uncomment after placing your favicon in /public
  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());

  // Using compression speeds up the connection (and uses much less data for mobile)
  app.use(compression());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/maps', require('../common/lib/maps').routeHandler); // No user authentication needed here, so place it before passport


  // Define Strategy, login
  passport.use(authStrategy.facebookStrategy);
  passport.use(authStrategy.googleStrategy);
  passport.use(authStrategy.localStrategy);
  // Session serializing of the user
  passport.serializeUser(authStrategy.serializeUser);
  // Session deserialisation of the user
  passport.deserializeUser(authStrategy.deserializeUser);
  // required for passport: configuration
  app.use(session({secret: 'ferropolyIsAGameWithAVeryLargePlayground', resave: true, saveUninitialized: false})); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

  // Set auth route
  require('../common/routes/auth')(app);


  app.use('/appinfo', infoRoute);
  signup.init(app, users);
  login.init(app, settings);
  authtoken.init(app);
  useradmin.init(app, settings, users);

  app.use('/', routes);
  app.use('/issuetracker', issuetracker);
  newgame.init(app);
  edit.init(app, gameplays, users, properties);
  gameplay.init(app);
  configuration.init(app, settings);
  app.use('/pricelist', pricelist);
  app.use('/player', require('./routes/player'));
  app.use('/admins', require('./routes/admins'));
  app.use('/userinfo', require('./routes/userInfo'));
  app.use('/account', require('./routes/account'));


  var server = require('http').Server(app);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err    = new Error('Not Found');
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
        error  : err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error  : {}
    });
  });


  app.set('port', settings.server.port);
  app.set('ip', settings.server.host);

  demoUsers.updateLogins(function(err) {
    if (err) {
      logger.error(err);
      process.exit(-1);
    }
    server.listen(app.get('port'), app.get('ip'), function () {
      logger.info('Ferropoly Editor, Copyright (C) 2015 Christian Kuster, CH-8342 Wernetshausen');
      logger.info('This program comes with ABSOLUTELY NO WARRANTY;');
      logger.info('This is free software, and you are welcome to redistribute it');
      logger.info('under certain conditions; see www.ferropoly.ch for details.');
      logger.info('Ferropoly Editor server listening on port ' + app.get('port'));
    });
  });

};

/**
 * Initialize DB connection, has to be only once for all models
 */
ferropolyDb.init(settings, function (err) {
  if (err) {
    logger.warning('Failed to init ferropolyDb');
    logger.error(err);
  }
  initServer();

});


module.exports = app;

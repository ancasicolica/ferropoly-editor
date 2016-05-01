/**
 * FERROPOLY GAME EDITOR APP
 *
 * (c) 2015 Christian Kuster, CH-8342 Wernetshausen
 *
 * @type {*|exports}
 */
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser      = require('body-parser');
const routes        = require('./routes/index');
const login         = require('./routes/login');
const signup        = require('./routes/signup');
const useradmin     = require('./routes/useradmin');
const edit          = require('./routes/edit');
const newgame       = require('./routes/newgame');
const gameplay      = require('./routes/gameplay');
const authtoken     = require('./routes/authtoken');
const issuetracker  = require('./routes/issuetracker');
const configuration = require('./routes/configuration');
const infoRoute     = require('../common/routes/info');
const settings      = require('./settings');
const passport      = require('passport');
const session       = require('express-session');
const flash         = require('connect-flash');
const app           = express();
const users         = require('../common/models/userModel');
const gameplays     = require('../common/models/gameplayModel');
const properties    = require('../common/models/propertyModel');
const ferropolyDb   = require('../common/lib/ferropolyDb');
const pricelist     = require('./routes/pricelist');
const cronjobs      = require('./lib/cronjobs');
const logger        = require('../common/lib/logger').getLogger('editor-app');
const mailer        = require('../common/lib/mailer');
const logs          = require('../common/models/logModel');
const morgan        = require('morgan');
const moment        = require('moment');
const compression   = require('compression');
const authStrategy  = require('../common/lib/authStrategy')(settings, users);
const demoUsers     = require('./lib/demoUsers');

var initServer      = function () {
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
  app.use('/agb', require('../common/routes/agb'));


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

  demoUsers.updateLogins(function (err) {
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

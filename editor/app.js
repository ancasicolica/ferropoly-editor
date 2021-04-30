/**
 * FERROPOLY GAME EDITOR APP
 *
 * (c) 2015 Christian Kuster, CH-8342 Wernetshausen
 *
 * @type {*|exports}
 */

// Logging has highest prio
const settings = require('./settings');
const logging  = require('../common/lib/logger');
logging.init({debugLevel: settings.logger.debugLevel});
const logger = logging.getLogger('editor-app');


const express      = require('express');
const path         = require('path');
const bodyParser   = require('body-parser');
const routes       = require('./routes/index');
const login        = require('./routes/login');
const useradmin    = require('./routes/useradmin');
const edit         = require('./routes/edit');
const newgame      = require('./routes/newgame');
const gameplay     = require('./routes/gameplay');
const authtoken    = require('./routes/authtoken');
const infoRoute    = require('../common/routes/info');
const debugRoute   = require('../common/routes/debug');
const passport     = require('passport');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const flash        = require('connect-flash');
const app          = express();
const users        = require('../common/models/userModel');
const gameplays    = require('../common/models/gameplayModel');
const properties   = require('../common/models/propertyModel');
const ferropolyDb  = require('../common/lib/ferropolyDb');
const pricelist    = require('./routes/pricelist');
const cronjobs     = require('./lib/cronjobs');
const mailer       = require('../common/lib/mailer');
const moment       = require('moment');
const compression  = require('compression');
const authStrategy = require('../common/lib/authStrategy')(settings, users);
const demoUsers    = require('./lib/demoUsers');
const {v4: uuid}   = require('uuid');

let initServer = function () {
  cronjobs.init();
  mailer.init(settings);

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  //morgan.token('prefix', function getId(req) {
  //  return 'http: ' + moment().format();
  //});
  // app.use(morgan(':prefix :method :status :remote-addr :url'));
  logging.setExpressLogger(app);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  // Using compression speeds up the connection (and uses much less data for mobile)
  app.use(compression());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/maps', require('../common/lib/maps').routeHandler); // No user authentication needed here, so place it before passport


  // Define Strategy, login
  passport.use(authStrategy.facebookStrategy);
  passport.use(authStrategy.googleStrategy);
  passport.use(authStrategy.dropboxStrategy);
  passport.use(authStrategy.twitterStrategy);
  passport.use(authStrategy.localStrategy);
  // Session serializing of the user
  passport.serializeUser(authStrategy.serializeUser);
  // Session deserialisation of the user
  passport.deserializeUser(authStrategy.deserializeUser);
  // required for passport: configuration
  app.use(session({
    secret           : 'ferropolyIsAGameWithAVeryLargePlayground',
    resave           : true,
    saveUninitialized: false,
    cookie           : {
      secure: 'auto'
    },
    genid            : function () {
      return 'E_' + moment().format('YYMMDD-HHmmss-') + uuid();
    },
    store            : MongoStore.create({mongoUrl: settings.locationDbSettings.mongoDbUrl, ttl: 2 * 24 * 60 * 60}),
    name             : 'ferropoly-editor'
  }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

  // Set auth route
  require('../common/routes/auth')(app);

  app.use('/appinfo', infoRoute(settings, require('./lib/infoRouteData')));
  app.use('/debug', debugRoute(settings.integrationTest));
  login.init(app, settings);
  authtoken.init(app);
  useradmin.init(app, settings, users);

  app.use('/', routes);
  newgame.init(app);
  edit.init(app, gameplays, users, properties);
  gameplay.init(app);
  app.use('/pricelist', pricelist);
  app.use('/player', require('./routes/player'));
  app.use('/admins', require('./routes/admins'));
  app.use('/userinfo', require('./routes/userInfo'));
  app.use('/account', require('./routes/account'));
  app.use('/test', require('./routes/test'));
  app.use('/agb', require('../common/routes/agb'));
  app.use('/rules', require('./routes/rules'));


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
    app.use(function (err, req, res) {
      let status    = err.status || 500;
      let errorPage = 'error';
      res.status(status);
      switch (status) {
        case 401:
          errorPage = 'error/401';
          break;
        case 403:
          errorPage = 'error/403';
          break;
        case 404:
          errorPage = 'error/404';
          break;
      }
      res.render(errorPage, {
        message: err.message,
        error  : err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res) {
    let status    = err.status || 500;
    let errorPage = 'error';
    res.status(status);
    switch (status) {
      case 401:
        errorPage = 'error/401';
        break;
      case 403:
        errorPage = 'error/403';
        break;
      case 404:
        errorPage = 'error/404';
        break;
    }
    res.render(errorPage, {
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
ferropolyDb.init(settings, function (err, db) {
  if (err) {
    logger.warning('Failed to init ferropolyDb');
    logger.error(err);
  }
  initServer(db);

});

module.exports = app;

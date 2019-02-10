/**
 * Release candidate settings
 * Created by kc on 30.08.15.
 */



module.exports = function (settings) {
  settings.version += '-RC';

  settings.server = {
    port: 3202,
    host: 'app.ferropoly.ch',
    serverId: 'editor-app.ferropoly.ch-v' + settings.version
  };

  settings.publicServer = {
    port: 80,
    host: 'spiel-rc.ferropoly.ch'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly_rc',
    poolSize: 3
  };

  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    createDemoGameplay: '45 1 * * *',
    deleteOldGameplays: '45 2 * * *'
  };

  settings.demoGameplay = {
    addDays: 0
  };

  settings.mailer = {
    senderAddress: process.env.MAILER_SENDER,
    host: process.env.MAILER_HOST,
    port: 465,
    secure: true,
    auth: {
      pass: process.env.MAILER_PASS,
      user: process.env.MAILER_USER
    }
  };

  // Facebook settings
  settings.oAuth.facebook.callbackURL = 'https://editor-rc.ferropoly.ch/auth/facebook/callback';
  // Google Settings
  settings.oAuth.google.callbackURL = 'https://editor-rc.ferropoly.ch/auth/google/callback';
  // Dropbox settings
  settings.oAuth.dropbox.callbackURL = 'https://editor-rc.ferropoly.ch/auth/dropbox/callback';
  // Twitter settings
  settings.oAuth.twitter.callbackURL  = 'https://editor-rc.ferropoly.ch/auth/twitter/callback';


  settings.mainInstances = ['http://spiel-rc.ferropoly.ch'];

  // Logger
  settings.logger = {
    debugLevel: 'debug'
  };

  return settings;
};

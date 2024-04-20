/**
 * Release candidate settings
 * Created by kc on 30.08.15.
 */


module.exports = function (settings) {
  settings.version += '-RC';

  settings.server = {
    port    : 3202,
    host    : 'app.ferropoly.ch',
    serverId: 'editor-app.ferropoly.ch-v' + settings.version
  };

  settings.publicServer = {
    port: 80,
    host: 'spiel-rc.ferropoly.ch'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly_rc',
    poolSize  : 3
  };

  settings.autopilot = {
    enabled: true
  }

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
    host         : process.env.MAILER_HOST,
    port         : 465,
    secure       : true,
    auth         : {
      pass: process.env.MAILER_PASS,
      user: process.env.MAILER_USER
    }
  };

  // Google Settings
  settings.oAuth.google.callbackURL    = 'https://editor-rc.ferropoly.ch/auth/google/callback';
  // Microsoft settings
  settings.oAuth.microsoft.callbackURL = 'https://editor-rc.ferropoly.ch/auth/microsoft/callback';

  settings.mainInstances = ['https://spiel-rc.ferropoly.ch'];

  process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/kc/ferropoly/ferropoly-service.json'

  // Logger
  settings.logger = {
    debugLevel: 'info',
    google: {
      enabled: true,
      projectId: 'crack-lamp-784',
      logName: 'editor_rc',
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
    }
  };

  return settings;
};

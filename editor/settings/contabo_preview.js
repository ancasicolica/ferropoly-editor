/**
 * Settings for the contabo server. Fix IP is 5.189.159.156
 * Created by kc on 15.08.15.
 */


module.exports = function (settings) {
  settings.version += '-PREVIEW';

  settings.server = {
    port    : 3102,
    host    : 'app.ferropoly.ch',
    serverId: 'editor-app.ferropoly.ch-v' + settings.version
  };

  settings.publicServer = {
    port: 80,
    host: 'spiel-preview.ferropoly.ch'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly_preview',
    poolSize  : 3
  };

  settings.autopilot = {
    enabled: true
  }

  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    createDemoGameplay: '30 1 * * *',
    deleteOldGameplays: '30 2 * * *'
  };


  settings.demoGameplay = {
    addDays: 0,
    seed   : 1   // Seed for demo game generation
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
  settings.oAuth.google.callbackURL    = 'https://editor-preview.ferropoly.ch/auth/google/callback';
  // Microsoft settings
  settings.oAuth.microsoft.callbackURL = 'https://editor-preview.ferropoly.ch/auth/microsoft/callback';

  settings.mainInstances = ['https://spiel-preview.ferropoly.ch'];

  process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/kc/ferropoly/ferropoly-service.json'

  // Logger
  settings.logger = {
    debugLevel: 'debug',
    google    : {
      enabled  : true,
      projectId: 'crack-lamp-784',
      logName  : 'editor_preview',
      keyFile  : process.env.GOOGLE_APPLICATION_CREDENTIALS
    }
  };

  return settings;
};

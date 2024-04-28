/**
 * Settings for the contabo server. Fix IP is 5.189.159.156
 * Created by kc on 15.08.15.
 */


module.exports = function (settings) {

  settings.server = {
    port    : 3002,
    host    : 'app.ferropoly.ch',
    serverId: 'editor-app.ferropoly.ch-v' + settings.version
  };

  settings.publicServer = {
    port: 80,
    host: 'spiel.ferropoly.ch'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly',
    poolSize  : 5
  };

  settings.autopilot = {
    enabled: false
  }


  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    createDemoGameplay: '12 1 * * *',
    deleteOldGameplays: '12 2 * * *'
  };

  // Google Settings
  settings.oAuth.google.callbackURL    = 'https://editor.ferropoly.ch/auth/google/callback';
  // Microsoft settings
  settings.oAuth.microsoft.callbackURL = 'https://editor.ferropoly.ch/auth/microsoft/callback';

  settings.demoGameplay = {
    addDays: 0,
    seed   : 3   // Seed for demo game generation
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

  settings.mainInstances = ['https://spiel.ferropoly.ch'];

  process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/kc/ferropoly/ferropoly-service.json'

  // Logger
  settings.logger = {
    debugLevel: 'info',
    google: {
      enabled: true,
      projectId: 'crack-lamp-784',
      logName: 'editor',
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
    }
  };
  return settings;
}
;

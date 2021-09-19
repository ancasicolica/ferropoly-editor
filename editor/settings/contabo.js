/**
 * Settings for the contabo server. Fix IP is 5.189.159.156
 * Created by kc on 15.08.15.
 */



module.exports = function (settings) {

  settings.server = {
    port: 3002,
    host: 'app.ferropoly.ch',
    serverId: 'editor-app.ferropoly.ch-v' + settings.version
  };

  settings.publicServer = {
    port: 80,
    host: 'spiel.ferropoly.ch'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly',
    poolSize: 5
  };


  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    createDemoGameplay: '12 1 * * *',
    deleteOldGameplays: '12 2 * * *'
  };

  // Facebook settings
  settings.oAuth.facebook.callbackURL = 'https://editor.ferropoly.ch/auth/facebook/callback';
  // Google Settings
  settings.oAuth.google.callbackURL = 'https://editor.ferropoly.ch/auth/google/callback';
  // Twitter settings
  settings.oAuth.twitter.callbackURL  = 'https://editor.ferropoly.ch/auth/twitter/callback';
  // Microsoft settings
  settings.oAuth.microsoft.callbackURL  = 'https://editor.ferropoly.ch/auth/microsoft/callback';

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

  settings.mainInstances = ['http://spiel.ferropoly.ch'];

  // Logger
  settings.logger = {
    debugLevel: 'info'
  };

  return settings;
}
;

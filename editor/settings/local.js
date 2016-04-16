/**
 * Created by kc on 07.12.14.
 */

module.exports = function (settings) {

  settings.server = {
    port    : 3002,
    host    : 'localhost',
    serverId: 'localhost-editor'
  };

  settings.publicServer = {
    port: 3002,
    host: 'localhost'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly'
  };

  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    deleteOldGameplays: '30 * * * *'
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

  // Facebook settings
  settings.oAuth.facebook.callbackURL = 'http://localhost:3002/auth/facebook/callback';
  // Google Settings
  settings.oAuth.google.callbackURL = 'http://localhost:3002/auth/google/callback';

  // Ferropoly main instances to update when a gameplay was added / removed
  settings.mainInstances = ['http://localhost:3004'];

  return settings;
};

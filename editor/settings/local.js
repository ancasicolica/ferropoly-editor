/**
 * Created by kc on 07.12.14.
 */

const path     = require('path');
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
    mongoDbUrl: 'mongodb://localhost/ferropoly',
    poolSize  : 3
  };

  settings.autopilot = {
    enabled: true
  }

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

  // Local settings for integration test
  settings.integrationTest = {
    key: '1234'
  };

  // Google Settings
  settings.oAuth.google.callbackURL    = 'http://localhost:3002/auth/google/callback';
  // Microsoft settings
  settings.oAuth.microsoft.callbackURL = 'http://localhost:3002/auth/microsoft/callback';

  // Ferropoly main instances to update when a gameplay was added / removed
  settings.mainInstances = ['http://localhost:3004'];

  process.env.GOOGLE_APPLICATION_CREDENTIALS =  path.join(__dirname, '..', '..', '..', 'ferropoly-service.json');

  // Logger
  settings.logger = {
    debugLevel: 'silly',
    google: {
      enabled: true,
      projectId: 'crack-lamp-784',
      logName: 'editor_local',
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
    }
  };



  return settings;
};

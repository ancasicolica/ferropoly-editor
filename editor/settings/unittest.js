/**
 * Unit-Test settings
 * Created by kc on 06.09.15.
 */
'use strict';

module.exports = function (settings) {

  settings.server = {
    port: 3002,
    host: 'localhost',
    serverId: 'localhost-editor'
  };

  settings.publicServer = {
    port: 3002,
    host: 'localhost'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly'
  };

  settings.cron = {};

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

  // Ferropoly main instances to update when a gameplay was added / removed
  settings.mainInstances = [];

  return settings;
};

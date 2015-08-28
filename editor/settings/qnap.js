/**
 * Settings for the server 'stella'
 *
 * used only when
 * export DEPLOY_TYPE="stella"
 * is entered before starting
 *
 * Created by kc on 03.04.15.
 */
'use strict';

module.exports = function(settings) {

  settings.server = {
    port: 3002,
    host: '0.0.0.0',
    serverId: 'qnap-editor'
  };

  settings.publicServer = {
    port: 3002,
    host: 'ferropoly.synology.me'
  };

  settings.locationDbSettings = {
    mongoDbUrl: process.env.FERROPOLY_CONNECTION_STRING
  };

  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    createDemoGameplay : '30 4 * * *'
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

  // Ferropoly main instances to update when a gameplay was added / removed
  settings.mainInstances = ['http://spiel.ferropoly.ch'];

  return settings;
};

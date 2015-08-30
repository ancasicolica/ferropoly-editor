/**
 * Settings for the contabo server. Fix IP is 5.189.159.156
 * Created by kc on 15.08.15.
 */
'use strict';


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
    mongoDbUrl: process.env.FERROPOLY_CONNECTION_STRING
  };


  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    createDemoGameplay: '0 1 * * *'
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

  settings.mainInstances = ['http://spiel.ferropoly.ch'];

  return settings;
}
;

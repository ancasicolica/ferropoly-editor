/**
 * Release candidate settings
 * Created by kc on 30.08.15.
 */
'use strict';


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
    mongoDbUrl: 'mongodb://localhost/ferropoly'
  };

  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    createDemoGameplay: '45 1 * * *'
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

  settings.mainInstances = ['http://spiel-rc.ferropoly.ch'];

  return settings;
};
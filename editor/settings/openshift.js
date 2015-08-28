/**
 * Created by kc on 03.01.15.
 */

module.exports = function(settings) {

  settings.server = {
    port: process.env.OPENSHIFT_NODEJS_PORT,
    host: process.env.OPENSHIFT_NODEJS_IP,
    serverId: 'openshift-editor'
  };

  settings.publicServer = {
    port: 80,
    host: 'editor-ferropoly.rhcloud.com'
  };


  settings.locationDbSettings = {
    mongoDbUrl: process.env.FERROPOLY_CONNECTION_STRING
  };

  settings.cron = {
    // [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    // The openshift server is in EST (east coast USA)
    createDemoGameplay : '0 21 * * *'
  };

  // Ferropoly main instances to update when a gameplay was added / removed
  settings.mainInstances = ['http://spiel.ferropoly.ch'];


  settings.demoGameplay = {
    addDays : 1
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


  return settings;
};

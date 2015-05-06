/**
 * Created by kc on 03.01.15.
 */

module.exports = function(settings) {

  settings.server = {
    port: process.env.OPENSHIFT_NODEJS_PORT,
    host: process.env.OPENSHIFT_NODEJS_IP,
    serverId: 'openshift-editor'
  };

  settings.socketIoServer = {
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

  settings.demoGameplay = {
    addDays : 1
  };

  return settings;
};

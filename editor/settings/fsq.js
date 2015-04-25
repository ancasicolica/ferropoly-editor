/**
 * Created by kc on 01.01.15.
 */


module.exports = function(settings) {

  settings.server = {
    port: 3002,
    host: 'ferropoly.synology.me'
  };

  settings.socketIoServer = {
    port: 3002,
    host: 'ferropoly.synology.me'
  };

  settings.locationDbSettings = {
    mongoDbUrl: process.env.FERROPOLY_CONNECTION_STRING
  };

  settings.cron = {

  };

  return settings;
};

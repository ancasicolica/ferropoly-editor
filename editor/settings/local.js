/**
 * Created by kc on 07.12.14.
 */

module.exports = function(settings) {

  settings.server = {
    port: 3002,
    host: 'localhost'
  };

  settings.socketIoServer = {
    port: 3002,
    host: 'localhost'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly'
  };

  settings.cron = {
  };

  return settings;
};

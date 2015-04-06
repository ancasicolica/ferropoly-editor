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
    mongoDbUrl: 'mongodb://ferropolyMongoUser:DfA--nt846G1I7oDTll5OvzMbuGfoofg@ds029960.mongolab.com:29960/ferropoly'
  };

  settings.cron = {

  };

  return settings;
};

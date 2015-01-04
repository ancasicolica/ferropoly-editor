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
    mongoDbUrl: 'mongodb://ferropolyMongoUser:DfA--nt846G1I7oDTll5OvzMbuGfoofg@ds029960.mongolab.com:29960/ferropoly'
  };


  return settings;
};

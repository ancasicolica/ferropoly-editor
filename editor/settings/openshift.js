/**
 * Created by kc on 03.01.15.
 */

module.exports = function(settings) {

  settings.server = {
    port: process.env.OPENSHIFT_NODEJS_PORT,
    host: process.env.OPENSHIFT_NODEJS_IP
  };

  settings.socketIoServer = {
    port: 80,
    host: 'editor-ferropoly.rhcloud.com'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://ferropolyMongoUser:DfA--nt846G1I7oDTll5OvzMbuGfoofg@ds029960.mongolab.com:29960/ferropoly'
  };



  return settings;
};

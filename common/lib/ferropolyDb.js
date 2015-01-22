/**
 * Access to the Ferropoly Database
 *
 * Created by kc on 02.01.15.
 */

var mongoose = require('mongoose');

module.exports = {

  init: function (settings, callback) {
    console.log('Connecting to MongoDb');
    // Connect to the MongoDb
    var options = {
      server: {
        socketOptions: {keepAlive: 1}
      },
      replset: {
        socketOptions: {keepAlive: 1}
      }
    };
    mongoose.connect(settings.locationDbSettings.mongoDbUrl, options);
    db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDb: connection error:'));


    db.once('open', function cb() {
      console.log('yay!');
      return callback(null, db);
    });
  }
};

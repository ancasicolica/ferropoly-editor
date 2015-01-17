/**
 * Access to the Ferropoly Database
 *
 * Created by kc on 02.01.15.
 */

var mongoose = require('mongoose');

module.exports = {

  init: function (settings, callback) {
    // Connect to the MongoDb
    mongoose.connect(settings.locationDbSettings.mongoDbUrl);
    db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDb: connection error:'));

    db.once('open', function cb() {
      console.log('yay!');
      return callback(null, db);
    });
  }
};

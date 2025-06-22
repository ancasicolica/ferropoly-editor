/**
 * Access to the Ferropoly Database
 *
 *  !!!! THE SOURCE IS MAINTAINED IN THE FERROPOLY-EDITOR PROJECT !!!!
 * Created by kc on 02.01.15.
 */

const mongoose = require('mongoose');
const logger   = require('./logger').getLogger('ferropolyDb');

let db           = undefined;
let mongooseThis = undefined;

// Needed for the new mongoose, using the ES6 native promises
mongoose.Promise = global.Promise;

module.exports = {
  /**
   * Get the DB of the module
   * @returns {undefined}
   */
  getDb: function () {
    return db;
  },

  /**
   * Initializes the database connection with the specified settings.
   *
   * This function establishes a connection to a MongoDB instance, using the provided configuration settings.
   * If the database is already initialized, it returns the existing connection instance.
   * Note: The use of callback functions is no longer supported.
   *
   * @param {Object} settings - The configuration settings for the database connection.
   * @param {Object} settings.locationDbSettings - The database connection parameters.
   * @param {string} settings.locationDbSettings.mongoDbUrl - The MongoDB connection URL.
   * @param {number} [settings.locationDbSettings.poolSize] - Optional pool size for the database connection. Defaults to 5.
   * @param {Function} [callback] - Deprecated. Callback function, not supported anymore.
   * @return {Promise<Object>} A promise that resolves to the database connection instance.
   */
  init: async function (settings, callback) {
    if (callback) {
      logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in db.init is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
      return callback('NOT SUPPORTED ANYMORE!');
    }

    let poolSize = settings.locationDbSettings.poolSize || 5;
    logger.info(`Connecting to MongoDb with a pool size of ${poolSize}`);

    // Already initialized
    if (db) {
      return db;
    }

    // Connect to the MongoDb
    let options = {
      maxPoolSize: poolSize,
    };
    mongoose.set('strictQuery', false);
    mongooseThis = await mongoose.connect(settings.locationDbSettings.mongoDbUrl, options);
    db           = mongoose.connection;
    logger.info('Connected to MongoDb');

    db.on('error', function (err) {
      logger.error('MongoDb Connection Error:', err);
      if (!mongooseThis) {
        return;
      }
      logger.info('Killing myself, since I got an error from the repo... (did you start mongodb?), starting kill timer...');
      /*eslint no-process-exit:0*/
      setTimeout(function () {
        logger.info('Killing instance now');
        process.exit(1);
      }, 2000);
    });

    db.on('disconnected', function () {
      logger.error('MongoDb Connection disconnected');
      if (!mongooseThis) {
        return;
      }
      if (!process.env.INTEGRATION_TEST) {
        logger.info('Killing myself, since I got a disconnect from the repo... (did you start mongodb?), starting kill timer...');
        setTimeout(function () {
          logger.info('Killing instance now');
          process.exit(1);
        }, 2400);
      }
    });
  },

  /**
   * Closes the MongoDB connection and clears associated resources.
   *
   * @param {Function} [callback] - An optional callback function. Note: Callbacks are no longer supported for this method.
   *                                If provided, an error message will be returned through the callback.
   * @return {Promise<void>} - A promise that resolves when the connection is successfully closed.
   */
  close: async function (callback) {
    if (callback) {
      logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in db.close is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
      return callback('NOT SUPPORTED ANYMORE!');
    }
    logger.info('Disconnecting MongoDb');
    if (db) {
      db.removeAllListeners('disconnected');
      db.removeAllListeners('error');
      await mongoose.disconnect();
    }
    mongooseThis = null;
    db = null;
  }
};

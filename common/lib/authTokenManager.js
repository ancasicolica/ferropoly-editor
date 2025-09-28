/**
 * Token manager for the socket.io connection
 *
 * Created by kc on 10.05.15.
 */

const {v4: uuid} = require('uuid');
const mongoose   = require('mongoose');
const tokens     = {};
const logger     = require('../lib/logger').getLogger('authTokenManager');

const tokenSchema = mongoose.Schema({
  login:      String,
  id:         String,
  issueDate:  {type: Date, default: Date.now},
  expiryDate: Date
});

const Token = mongoose.model('Token', tokenSchema);

/**
 * Retrieves a token associated with the specified user.
 *
 * @param {string} user The login or identifier of the user for whom the token is being retrieved.
 * @param {function} callback The callback function to be executed once the token is retrieved or an error occurs.
 *                            It receives two arguments: an error object or null, and the retrieved token or null.
 * @return {Promise<void>} A promise that resolves when the token retrieval process is complete and the callback is invoked.
 */
async function getToken(user, callback) {
  let token, err;
  try {
    token = await Token
      .findOne()
      .where('login').equals(user)
      .exec();
  }
  catch (ex) {
    logger.error('Failed to get token', ex);
    err = ex;
  }
  finally {
    callback(err, token);
  }
}

/**
 * Retrieves an asynchronous token for a given user.
 *
 * @param {string} user - The login identifier of the user for token retrieval.
 * @return {Promise<Object>} A promise that resolves to the token object associated with the user, or null if no token is found.
 */
async function getTokenAsync(user) {
  return await Token
    .findOne()
    .where('login').equals(user)
    .exec();
}

/**
 * Generates and retrieves a new authentication token for a specified user.
 *
 * @param {Object} options - The options for generating the token.
 * @param {string} options.user - The username for which the token is requested.
 * @param {string} [options.proposedToken] - The proposed token value, if available.
 * @return {Promise<string>} A promise that resolves to the ID of the newly generated or existing token.
 */
async function getNewTokenAsync(options) {
  logger.silly(`New authtoken requested for ${options.user} suggesting '${options.proposedToken}'`)
  let token = await getTokenAsync(options.user);
  if (token && token.id === options.proposedToken) {
    // when the authtoken is available and the same, we quit now
    logger.silly(`${options.user} has already authtoken '${options.proposedToken}'`)
    return options.proposedToken;
  }
  if (!token) {
    // Create a new token if not existing
    token = new Token();
  }
  token.id    = options.proposedToken || uuid();
  token.login = options.user;
  let res = await token.save();
  logger.info(`User ${options.user} has now authtoken ${token.id}`);
  return res.id;
}

module.exports = {
  /**
   * Generate a new token (or uses the proposed one)
   * @param options
   * @param callback
   */
  getNewToken: function (options, callback) {
    getNewTokenAsync(options)
      .then(token => {
        return callback(null, token);
      })
      .catch(err => {
        return callback(err);
      })
  },

  getNewTokenAsync,

  /**
   * Verifies a token
   * @param user
   * @param userToken
   * @param callback
   * @returns {*}
   */
  verifyToken: function (user, userToken, callback) {
    if (tokens[user]) {
      if (tokens[user].id === userToken) {
        return callback(null);
      }
    }
    getToken(user, function (err, token) {
      if (err) {
        return callback(err);
      }
      if (!token) {
        logger.info(`Not able to find any authtoken for '${user}'`);
        return callback(new Error('No token retrieved in verifyToken!'));
      }
      if (userToken === token.id) {
        tokens[user] = token;
        return callback(null);
      }
      logger.info(`Authtoken invalid, supplied '${userToken}' but got ${token.id} for ${user}`);
      callback(new Error('invalid token'));
    }).then(() => {
    });
  }
};

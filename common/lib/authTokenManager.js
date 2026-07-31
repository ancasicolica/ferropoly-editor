/**
 * Token manager for the socket.io connection
 *
 * Created by kc on 10.05.15.
 */

const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const tokens = new Map();
const logger = require('../lib/logger').getLogger('authTokenManager');

const tokenSchema = mongoose.Schema({
  login: String,
  id: String,
  issueDate: { type: Date, default: Date.now },
  expiryDate: Date,
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = {
  /**
   * Retrieves or generates a token for the given user. If a token exists in memory but is expired, it retrieves a fresh one from the database
   * or creates a new token if none exists. The token is cached in memory with an updated expiration date.
   *
   * @param {string} user - The username for which the token is being requested.
   * @return {Promise<Object>} A promise that resolves to a token object containing `login`, `id`, `issueDate`, and `expiryDate` properties.
   */
  getToken: async function (user) {
    try {
      const entry = tokens.get('user');
      if (entry) {
        if (entry.expiryDate < DateTime.now().toJSDate()) {
          return entry;
        }
      }

      let token = await Token.findOne().where('login').equals(user).exec();

      if (token) {
        logger.info(`Known authtoken for '${user}': ${token.id}`);
      } else {
        token = new Token();
        token.login = user;
        token.id = uuid();
        logger.info(`New authtoken for '${user}': ${token.id}`);
      }

      token.expiryDate = DateTime.now()
        .plus({ days: 1 })
        .startOf('day')
        .toJSDate();

      tokens.set(user, token);
      await token.save();
      return token;
    } catch (err) {
      // Return a random token, not a default one
      return {
        login: user,
        id: 'xtra' + Math.ceil(Math.random() * 10000000),
        issueDate: DateTime.now().toJSDate(),
        expiryDate: DateTime.now().minus({ minutes: 1 }).toJSDate(),
      };
    }
  },

  /**
   * Verifies a token
   * @param user
   * @param userToken
   * @returns boolean
   */
  verifyToken: async function (user, userToken) {
    try {
      // Try if it is in the cache
      const entry = tokens.get(user);
      if (entry) {
        if (
          entry.id === userToken &&
          entry.expiryDate < DateTime.now().toJSDate()
        ) {
          return true;
        }
      }
      // Not in cache or expired, try to get it out of the DB
      const token = await Token.findOne().where('login').equals(user).exec();

      if (!token) {
        logger.info(`Not able to find any authtoken for '${user}'`);
        return false;
      }
      if (token.expiryDate < DateTime.now().toJSDate()) {
        logger.info(`authtoken for ${user} expired`, token);
        return false;
      }
      if (userToken === token.id) {
        tokens[user] = token;
        return true;
      }
      logger.info(
        `Authtoken invalid, supplied '${userToken}' but got ${token.id} for ${user}`,
        token
      );
      return false;
    } catch (err) {
      logger.error(err);
      return false;
    }
  },

  /**
   * Cleans up expired tokens from both the in-memory cache and the database.
   * Removes expired entries from the tokens Map based on their expiry date,
   * and deletes matching entries from the database.
   *
   * @return {Promise<{cacheRemoved: number, dbRemoved: number}>} An object containing the count of tokens removed
   * from the in-memory cache and the database.
   * @throws Will throw an error if the cleanup process encounters an issue.
   */
  cleanUp: async function () {
    try {
      const now = DateTime.now().toJSDate();
      const expiredUsers = [];

      // Find expired entries in the Map
      for (const [user, token] of tokens.entries()) {
        if (token.expiryDate < now) {
          expiredUsers.push(user);
        }
      }

      // Remove expired tokens from the Map
      for (const user of expiredUsers) {
        tokens.delete(user);
      }

      // Remove expired tokens from the database
      const result = await Token.deleteMany({
        expiryDate: { $lt: now },
      }).exec();

      logger.info(
        `Cleanup completed: removed ${expiredUsers.length} entries from cache and ${result.deletedCount} from database`
      );

      return {
        cacheRemoved: expiredUsers.length,
        dbRemoved: result.deletedCount,
      };
    } catch (err) {
      logger.error('Error during cleanup', err);
      throw err;
    }
  },
};

/**
 * Challenger – the module that handles challenge changes. Here's hoping it doesn't blow up, fully aware that’s a
 * terrible joke. I dare say the narrow-minded anorak I used to work with would have picked a different name, though
 * whenever I look at their atrocious naming decisions, it genuinely makes me want to chunder.
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 22.11.2026
 **/

const EventEmitter                                          = require('node:events');
const challenges                                            = require('../models/challengeModel');
const events                                                = require('../models/schedulerEventModel');
const halfTime                                              = require('../lib/halfTime');
const {CHALLENGE_START, CHALLENGE_HALF_TIME, CHALLENGE_END} = require('./schedulerEventTypes');
const logger                                                = require('../lib/logger').getLogger('Challenger');

class Challenger extends EventEmitter {
  constructor() {
    super();
    logger.info('Challenger instance initiated');
  }

  /**
   * Updates, or creates if not existing, a challenge
   * @param gameId
   * @param challenge
   * @return {Promise<boolean>}
   */
  async updateChallenge(gameId, challenge) {
    if (!challenge) {
      return null;
    }
    try {
      challenge = await challenges.updateChallenge(gameId, challenge);
      await events.createOrUpdateReferencedEvent(gameId, challenge.schedule.start, CHALLENGE_START, challenge._id, {message: 'Challenge Start'});
      await events.createOrUpdateReferencedEvent(gameId, halfTime(challenge.schedule.start, challenge.schedule.end), CHALLENGE_HALF_TIME, challenge._id, {message: 'Challenge Halbzeit'});
      await events.createOrUpdateReferencedEvent(gameId, challenge.schedule.end, CHALLENGE_END, challenge._id, {message: 'Challenge Ende'});
      logger.info(`${gameId}: Challenge and events updated`, challenge);
      this.emit('update', challenge);
      return challenge;
    }
    catch (err) {
      logger.error('Problem while updating Challenge', err.message);
      return null;
    }
  }

  /**
   * Deletes a challenge
   * @param gameId
   * @param challengeId
   * @return {Promise<boolean>}
   */
  async deleteChallenge(gameId, challengeId) {
    if (!challengeId) {
      return false;
    }
    try {
      await events.deleteReferencedEvents(gameId, challengeId);
      let res = !!(await challenges.deleteChallenge(gameId, challengeId));
      this.emit('delete', challengeId);
      return res;
    }
    catch (err) {
      logger.error('Problem while deleting Challenge', err);
      return false;
    }
  }
}

let challenger = null;
module.exports = function () {
  if (!challenger) {
    challenger = new Challenger();
  }
  return challenger;
}

/**
 * The challenge object
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 20.11.2026
 **/

import {get} from 'lodash';
import {DateTime} from 'luxon';

class Challenge {
  constructor(challenge = {}) {
    this._id         = get(challenge, '_id', null);
    this.gameId      = get(challenge, 'gameId', '');
    this.title       = get(challenge, 'title', '');
    this.description = get(challenge, 'description', '');
    this.schedule    = {
      start: get(challenge, 'schedule.start', null),
      end:   get(challenge, 'schedule.end', null),
    };
    this.proof       = {
      picture: get(challenge, 'proof.picture', true),
      call:    get(challenge, 'proof.call', false),
      text:    get(challenge, 'proof.text', false),
    };
    this.reward      = {
      min: get(challenge, 'reward.min', 1000),
      max: get(challenge, 'reward.max', 10000),
    };
    this.createdAt   = get(challenge, 'createdAt', null);
    this.updatedAt   = get(challenge, 'updatedAt', null);
  }
}

const createNewChallenge = function(gameId, options = {}) {
  if (!gameId) {
    return console.error('createNewChallenge expects a gameId');
  }
  return new Challenge({
    gameId,
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    title: options.title || ''
  })
}

export {Challenge, createNewChallenge};

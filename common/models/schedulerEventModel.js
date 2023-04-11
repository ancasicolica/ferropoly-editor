/**
 * Scheduling events: all planned events are stored in this DB
 * Created by kc on 01.05.15.
 */

const mongoose = require('mongoose');
const moment   = require('moment');
const _        = require('lodash');
const logger   = require('../lib/logger').getLogger('schedulerEventModel');
const async    = require('async');

/**
 * The mongoose schema for a scheduleEvent
 */
const scheduleEventSchema  = mongoose.Schema({
  _id      : String,
  gameId   : String, // Gameplay this team plays with
  timestamp: Date, // When it is going to happen
  type     : String, // What it is about
  handled  : {type: Boolean, default: false},
  handler  : {
    id      : String, // ID of the handler
    reserved: Date,
    handled : Date
  }
});
/**
 * The scheduleEvent model
 */
const scheduleEventModel = mongoose.model('schedulerEvent', scheduleEventSchema);

/**
 * Creates an event
 */
function createEvent(gameId, timestamp, type) {
  let event       = new scheduleEventModel();
  event.gameId    = gameId;
  event.timestamp = timestamp;
  event.type      = type;
  event._id       = gameId + '-' + moment(timestamp).format('YYMMDD-HHmm') + '-' + type;
  return event;
}

/**
 * Save all events. Dumps them all before adding new ones
 * @param events
 * @param callback
 */
function saveEvents(events, callback) {
  try {
    dumpEvents(events[0].gameId, function (err) {
      if (err) {
        return callback(err);
      }
      async.eachSeries(events, async (item) => {
          await item.save();
        },
        callback);
    });
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Dump all scheduled events of a gameplay
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function dumpEvents(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    logger.info('Removing all existing scheduler event information for ' + gameId);
    const res = await scheduleEventModel
      .deleteMany({gameId: gameId})
      .exec();
    callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}


/**
 * Gets the events of the next few hours
 * @param callback
 */
async function getUpcomingEvents(callback) {
  try {
    let untilTime = moment().add(4, 'h');

    const res = await scheduleEventModel
      .find()
      .where('handled').equals(false)
      .where('timestamp').lte(untilTime.toDate())
      .sort('timestamp')
      .lean()
      .exec();
    callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Gets an event to handle on a save way:
 * only if we can reserve the event for our handling it is returned. Therefore we read the
 * event, write it with our serverId and then check again if it is ours.
 * @param event
 * @param serverId
 * @param callback
 */
async function requestEventSave(event, serverId, callback) {
  try {
    const data = await scheduleEventModel
      .find()
      .where('_id').equals(event._id)
      .exec();

    if (data.length === 0) {
      return callback(new Error('Event not found! ID: ' + event._id));
    }

    let ev = data[0];
    if (ev.handler && ev.handler.id && ev.handler.id !== serverId) {
      // Someone else is handling it, forget it
      return callback(null, null);
    }
    ev.handler = {
      id      : serverId,
      reserved: new Date()
    };

    // Now try to save and read it back again after a short, random period
    const savedEvent = await ev.save();
    // This delay avoids collisions between two parallel servers
    let delay        = _.random(20, 200);
    logger.info('requestEventSave: delay: ' + delay + ' for event ' + savedEvent._id);
    _.delay(async function (_eventId, _serverId, _callback) {
        const data = await scheduleEventModel
          .find()
          .where('_id').equals(_eventId)
          .where('handler.id').equals(_serverId)
          .exec();

        if (!data || data.length === 0) {
          return _callback(null, null);
        }
        _callback(null, data[0]);

      },
      delay,
      savedEvent._id, serverId, callback);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Saves the event after handling it
 * @param event
 * @param callback
 * @returns {*}
 */
async function saveAfterHandling(event, callback) {
  try {
    if (!event) {
      return callback(new Error('No event supplied'));
    }
    if (!event.handler || !event.handler.reserved) {
      return callback(new Error('This event is not properly handled, can not save it!'));
    }
    event.handler.handled = new Date();
    event.handled         = true;

    let savedEvent = await event.save();
    logger.info('Event marked as finished');
    callback(null, savedEvent);

  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
  }
}

module.exports = {
  Model            : scheduleEventModel,
  createEvent      : createEvent,
  saveEvents       : saveEvents,
  dumpEvents       : dumpEvents,
  getUpcomingEvents: getUpcomingEvents,
  requestEventSave : requestEventSave,
  saveAfterHandling: saveAfterHandling
};

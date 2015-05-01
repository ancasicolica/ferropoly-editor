/**
 * Scheduling events: all planned events are stored in this DB
 * Created by kc on 01.05.15.
 */
'use strict';


var mongoose = require('mongoose');
var uuid = require('node-uuid');
/**
 * The mongoose schema for a scheduleEvent
 */
var scheduleEventSchema = mongoose.Schema({
  gameId: String, // Gameplay this team plays with
  timestamp: Date, // When it is going to happen
  type: String, // What it is about
  handled: {type: Boolean, default: false},
  handler: {
    id: String, // ID of the handler
    reserved: Date,
    handled: Date
  }
});
/**
 * The scheduleEvent model
 */
var scheduleEventModel = mongoose.model('schedulerEvent', scheduleEventSchema);

/**
 * Save all events. Dumps them all before adding new ones
 * @param events
 * @param callback
 */
function saveEvents(events, callback) {
  dumpEvents(events[0].gameId, function (err) {
    if (err) {
      return callback(err);
    }
    var error = undefined;
    var nbSaved = 0;

    for (var i = 0; i < events.length; i++) {
      events[i].save(function (err) {
        if (err) {
          error = err;
        }
        nbSaved++;

        if (nbSaved === events.length) {
          console.log('Events saved');
          callback(error);
        }
      });
    }
  });
}

/**
 * Dump all scheduled events of a gameplay
 * @param gameId
 * @param callback
 * @returns {*}
 */
function dumpEvents(gameId, callback) {
  if (!gameId) {
    return callback(new Error('No gameId supplied'));
  }
  console.log('Removing all existing scheduler event information for ' + gameId);
  scheduleEventModel.remove({gameId: gameId}, function (err) {
    callback(err);
  });
}


module.exports = {
  Model: scheduleEventModel,
  saveEvents: saveEvents,
  dumpEvents: dumpEvents
};

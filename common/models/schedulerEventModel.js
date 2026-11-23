/**
 * Scheduling events: all planned events are stored in this DB
 * Created by kc on 01.05.15.
 */

const mongoose   = require('mongoose');
const {DateTime} = require('luxon');
const logger     = require('../lib/logger').getLogger('schedulerEventModel');

/**
 * The mongoose schema for a scheduleEvent
 */
const scheduleEventSchema = mongoose.Schema({
  _id:       String,
  gameId:    String, // Gameplay this team plays with
  timestamp: Date,   // When it is going to happen
  type:      String, // What it is about
  message:   String, // Info text, optional
  reference: {type: String, default: null}, // a reference to "something else" in the context of the type
  handled:   {type: Boolean, default: false},
  handler:   {
    id:       String, // ID of the handler
    reserved: Date,
    handled:  Date
  }
});
/**
 * The scheduleEvent model
 */
const scheduleEventModel  = mongoose.model('schedulerEvent', scheduleEventSchema);

/**
 * Creates an event
 */
function createEvent(gameId, timestamp, type, message = null, options = {}) {
  let event       = new scheduleEventModel();
  event.gameId    = gameId;
  event.timestamp = timestamp;
  event.type      = type;
  if (options.reference) {
    event._id       = gameId + '-referenced-' + options.reference + '-' + type;
    event.reference = options?.reference;
  } else {
    event._id = gameId + '-' + DateTime.fromJSDate(timestamp).toFormat('yyMMdd-HHmm') + '-' + type;
  }
  event.message = message;

  return event;
}

/**
 * Updates or creates an event with a reference
 * @param gameId
 * @param timestamp
 * @param type
 * @param reference
 * @param options
 * @return {Promise<Array<HydratedDocument<InferSchemaType<*>, ObtainSchemaGeneric<*, 'TInstanceMethods'>,
 *   ObtainSchemaGeneric<*, 'TVirtuals'>>>>}
 */
async function createOrUpdateReferencedEvent(gameId, timestamp, type, reference, options = {}) {
  let event = await scheduleEventModel
    .findOne()
    .where('gameId').equals(gameId)
    .where('reference').equals(reference)
    .where('type').equals(type)
    .exec();

  if (!(timestamp instanceof Date)) {
    timestamp = new Date(timestamp);
  }

  if (event) {
    event.timestamp = timestamp;
    event.message   = options?.message;
  } else {
    // Create a new event
    event = createEvent(gameId, timestamp, type, options?.message, {reference});
  }
  await event.save();
  return event;
}

/**
 * Delete referenced events, which can be more than one, all to the specific reference
 * @param gameId
 * @param reference
 * @return {Promise<DeleteResult>}
 */
async function deleteReferencedEvents(gameId, reference) {
  if (!gameId) {
    throw new Error('No gameId supplied');
  }
  if (!reference) {
    throw new Error('No reference supplied');
  }
  return await scheduleEventModel
    .deleteMany({gameId, reference})
    .exec();
}

/**
 * Returns all events of a game
 * @param gameId
 * @return {Promise<Array<HydratedDocument<InferSchemaType<*>, ObtainSchemaGeneric<*, 'TInstanceMethods'>,
 *   ObtainSchemaGeneric<*, 'TVirtuals'>>>>}
 */
async function getEvents(gameId) {
  return await scheduleEventModel
    .find()
    .where('gameId').equals(gameId)
    .where('timestamp').gt(new Date())
    .exec();
}

/**
 * Save all events. Dumps them all before adding new ones
 * @param events
 */
async function saveEvents(events) {
  await dumpEvents(events[0].gameId);
  for (const item of events) {
    await item.save();
  }
}

/**
 * Dump all scheduled events of a gameplay
 * @param gameId
 * @returns {*}
 */
async function dumpEvents(gameId) {
  if (!gameId) {
    throw new Error('No gameId supplied');
  }
  logger.info(`${gameId}: Removing all existing scheduler event information`);

  return await scheduleEventModel
    .deleteMany({gameId: gameId})
    .exec();
}

/**
 * Gets the events of the next few hours
 */
async function getUpcomingEvents() {
  let untilTime = DateTime.now().plus({hours: 4}).toJSDate();

  return await scheduleEventModel
    .find()
    .where('handled').equals(false)
    .where('timestamp').lte(untilTime)
    .sort('timestamp')
    .lean()
    .exec();
}

/**
 * This function was way to complicated, just save an event!
 * @param event
 * @param serverId
 */
async function requestEventSave(event, serverId) {
  const data = await scheduleEventModel
    .find()
    .where('_id').equals(event._id)
    .exec();

  if (data.length === 0) {
    throw new Error('Event not found! ID: ' + event._id);
  }

  let ev = data[0];
  if (ev.handler && ev.handler.id && ev.handler.id !== serverId) {
    // Someone else is handling it, forget it
    return;
  }
  ev.handler = {
    id:       serverId,
    reserved: new Date()
  };
  return await ev.save();
}

/**
 * Saves the event after handling it
 * @param event
 * @returns {*}
 */
async function saveAfterHandling(event) {
  if (!event) {
    throw new Error('No event supplied');
  }
  if (!event.handler || !event.handler.reserved) {
    throw new Error('This event is not properly handled, can not save it!');
  }

  event.handler.handled = new Date();
  event.handled         = true;
  let savedEvent        = await event.save();
  logger.info(`${event.gameId}: Event marked as finished`, {event});

  return savedEvent;
}

module.exports = {
  Model:             scheduleEventModel,
  createEvent:       createEvent,
  getEvents:         getEvents,
  saveEvents:        saveEvents,
  dumpEvents:        dumpEvents,
  getUpcomingEvents: getUpcomingEvents,
  requestEventSave:  requestEventSave,
  saveAfterHandling: saveAfterHandling,
  createOrUpdateReferencedEvent,
  deleteReferencedEvents
};

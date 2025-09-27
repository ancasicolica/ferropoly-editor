/**
 * Scheduler Event Library: all about the scheduled events found in the DB
 *
 * Created by kc on 01.05.15.
 */

 const eventModel = require('../models/schedulerEventModel');
const {DateTime} = require('luxon');
const {logger} = require('express-winston');

/**
 * Create all events for a gameplay (during finalization) and insert them in the DB
 * @param gameplay
 * @param callback
 */
async function createEvents(gameplay, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in createEvents is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  let events = [];

  // Pre-Start
  const startDateTime = DateTime.fromJSDate(gameplay.scheduling.gameStartTs);
  let prestart        = eventModel.createEvent(gameplay.internal.gameId,
    startDateTime.minus({minutes: 5}).toJSDate(),
    'prestart');
  events.push(prestart);

  // Start
  let start = eventModel.createEvent(gameplay.internal.gameId,
    gameplay.scheduling.gameStartTs,
    'start'
  );
  events.push(start);

  // Interests
  let dt            = DateTime.fromJSDate(gameplay.scheduling.gameStartTs);
  const endDateTime = DateTime.fromJSDate(gameplay.scheduling.gameEndTs);
  while (dt < endDateTime) {
    let interest = eventModel.createEvent(gameplay.internal.gameId,
      dt.toJSDate(),
      'interest');
    events.push(interest);

    dt = dt.plus({minutes: gameplay.gameParams.interestInterval});
  }

  // End
  let end = eventModel.createEvent(gameplay.internal.gameId,
    gameplay.scheduling.gameEndTs,
    'end'
  );
  events.push(end);

  // Summary available
  let summary = eventModel.createEvent(gameplay.internal.gameId,
    startDateTime.endOf('day').toJSDate(),
    'summary'
  );
  events.push(summary);

  await eventModel.saveEvents(events);
}

module.exports = {
  createEvents: createEvents
};

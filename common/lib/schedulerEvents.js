/**
 * Scheduler Event Library: all about the scheduled events found in the DB
 *
 * Created by kc on 01.05.15.
 */

const eventModel = require('../models/schedulerEventModel');
const {DateTime} = require('luxon');
const {PRESTART, START, INTEREST, END, SUMMARY} = require('../lib/schedulerEventTypes');

/**
 * Create all events for a gameplay (during finalization) and insert them in the DB
 * @param gameplay
 */
async function createEvents(gameplay) {
  let events = [];

  // Pre-Start
  const startDateTime = DateTime.fromJSDate(gameplay.scheduling.gameStartTs);
  let prestart        = eventModel.createEvent(gameplay.internal.gameId,
    startDateTime.minus({minutes: 5}).toJSDate(),
    PRESTART);
  events.push(prestart);

  // Start
  let start = eventModel.createEvent(gameplay.internal.gameId,
    gameplay.scheduling.gameStartTs,
    START,
    'Startkapital'
  );
  events.push(start);

  // Interests
  let dt            = DateTime.fromJSDate(gameplay.scheduling.gameStartTs);
  const endDateTime = DateTime.fromJSDate(gameplay.scheduling.gameEndTs);
  let round = 1;
  while (dt < endDateTime) {
    let interest = eventModel.createEvent(gameplay.internal.gameId,
      dt.toJSDate(),
      INTEREST,
      `Startgeld Runde ${round}`);
    events.push(interest);
    round++;
    dt = dt.plus({minutes: gameplay.gameParams.interestInterval});
  }

  // End
  let end = eventModel.createEvent(gameplay.internal.gameId,
    gameplay.scheduling.gameEndTs,
    END
  );
  events.push(end);

  // Summary available
  let summary = eventModel.createEvent(gameplay.internal.gameId,
    startDateTime.endOf('day').toJSDate(),
    SUMMARY
  );
  events.push(summary);

  await eventModel.saveEvents(events);
}

module.exports = {
  createEvents: createEvents
};

/**
 * Scheduler Event Model and SchedulerEvents Testing
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 11.04.23
 **/

const expect               = require('expect.js');
const db                   = require('./../../../../common/lib/ferropolyDb');
const schedulerEvents      = require('../../../../common/lib/schedulerEvents');
const schedulerEventsModel = require('../../../../common/models/schedulerEventModel');
const settings             = require('./../../../../editor/settings');
const {DateTime}           = require('luxon');

const gameId = 'unit-test';

describe('Scheduler Event Tests', function () {
  before(async function () {
    await db.init(settings);
    await schedulerEventsModel.dumpEvents(gameId);
  });

  // Close DB afterwards
  after(async function () {
    await schedulerEventsModel.dumpEvents(gameId);
    await db.close();
  });

  describe('Creating events for a game', () => {
    it('should create them', async () => {
      const info = await schedulerEvents.createEvents({
        internal:   {
          gameId: gameId
        },
        scheduling: {
          gameStartTs: DateTime.now().set({hour: 6, minute: 0}).toJSDate(),
          gameEndTs:   DateTime.now().set({hour: 22, minute: 0}).toJSDate(),
        },
        gameParams: {
          interestInterval: 60
        }
      });

      console.log(info);

    })
  })

  describe('Getting some events', () => {
    it('should hopefully return some', done => {
      schedulerEventsModel.getUpcomingEvents().then(events => {
        // This hardly depends on the games in the DB, do not analyse too much
        console.log(events);
        expect(events.length > 1).to.be(true);
        done();
      }).catch();
    })
  })

});

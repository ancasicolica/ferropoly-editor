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

describe('Chancellery Transaction Tests', function () {
  before(function (done) {
    db.init(settings, function () {
      schedulerEventsModel.dumpEvents(gameId, done)
    });
  });

  // Close DB afterwards
  after(function (done) {
    schedulerEventsModel.dumpEvents(gameId, () => {
      db.close(done);
    });
  });

  describe('Creating events for a game', () => {
    it('should create them', done => {
      schedulerEvents.createEvents({
        internal  : {
          gameId: gameId
        },
        scheduling: {
          gameStartTs: DateTime.now().set({hour: 6, minute:0}).toJSDate(),
          gameEndTs: DateTime.now().set({hour: 22, minute:0}).toJSDate(),
        },
        gameParams: {
          interestInterval: 60
        }
      }, (err, info) => {
        console.log(info);
        done(err);
      })
    })
  })

  describe('Getting some events', ()=> {
    it('should hopefully return some', done=> {
      schedulerEventsModel.getUpcomingEvents((err, events)=> {
        // This hardly depends on the games in the DB, do not analyse too much
        console.log(events);
        expect(events.length > 10).to.be(true);
        done(err);
      })
    })
  })

});

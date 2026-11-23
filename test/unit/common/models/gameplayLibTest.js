/**
 *
 * Created by kc on 14.02.15.
 */
'use strict';

const expect     = require('expect.js');
const db         = require('./../../../../common/lib/ferropolyDb');
const locations  = require('./../../../../common/models/locationModel');
const properties = require('./../../../../common/models/propertyModel');
const gameplays  = require('./../../../../common/models/gameplayModel');
const challenges = require('./../../../../common/models/challengeModel');
const events     = require('./../../../../common/models/schedulerEventModel');
const halfTime   = require('./../../../../common/lib/halfTime');
const {CHALLENGE_START, CHALLENGE_HALF_TIME, CHALLENGE_END} = require('./../../../../common/lib/schedulerEventTypes');
const settings   = require('./../../../../editor/settings');
const gplib      = require('./../../../../editor/lib/gameplayLib');
const {DateTime} = require('luxon');
const challengeTemplates = require('./../../../../editor/lib/ferropoly_challenges.json');
let gp;

describe('GameplayLib Tests', function () {
  before(async function () {
    await db.init(settings);
  });

  // Close DB afterwards
  after(async function () {
    await db.close();
  });

  describe('Creating a complete new gameplay', function () {
    it('should create a gameplay', async function () {
      const newGp = await gplib.createNewGameplay({
        email:    'anyone@me.com',
        map:      'zvv',
        gamename: 'LibTest',
        gameId:   'test',
        gamedate: DateTime.local(2020, 1, 1).toJSDate()
      });
      expect(newGp).not.to.be(undefined);
      expect(newGp.gamename).to.be('LibTest');
      gp = newGp;
    });
    it('should have the same number of properties as there are locations', async function () {
      const zvvLocs = await locations.getAllLocationsForMap('zvv');
      const props   = await properties.getPropertiesForGameplay(gp.internal.gameId, null);
      expect(props.length).to.be(zvvLocs.length);
    });
  });

  describe('Delete the complete gameplay', function () {
    it('should delete all properties of the gameplay', async function () {
      await gplib.deleteGameplay({gameId: gp.internal.gameId, ownerEmail: 'anyone@me.com'});
      // verifiy if really so
      const props = await properties.getPropertiesForGameplay(gp.internal.gameId, null);
      expect(props.length).to.be(0);
    });
    it('should delete the gameplay as well', function (done) {
      gameplays.getGameplay(gp.internal.gameId, 'anyone@me.com').catch((err) => {
        console.log(err)
        expect(err).not.to.be(undefined);
        done();
      });
    })
  });

  describe('Create the demo gameplay', function () {
    this.timeout(15000);
    it('should create the demo gameplay', async function () {
      await gplib.createDemoGameplay({});
      const demo = await gameplays.getGameplay('play-a-demo-game', 'demo@ferropoly.ch');
      const entries = (await challenges.getChallenges(demo.internal.gameId))
        .sort((a, b) => a.schedule.start - b.schedule.start);
      const templates = new Map(challengeTemplates.map(entry => [entry.title, entry]));

      expect(entries.length).to.be(30);
      expect(entries[0].schedule.start.getTime()).to.be(demo.scheduling.gameStartTs.getTime());
      expect(entries[entries.length - 1].schedule.end.getTime()).to.be(demo.scheduling.gameEndTs.getTime());
      expect(new Set(entries.map(entry => entry.title)).size).to.be(entries.length);
      entries.forEach((entry, index) => {
        const template = templates.get(entry.title);
        expect(template).to.be.ok();
        expect(entry.description).to.be(template.description);
        expect(entry.proof).to.eql(template.proof);
        expect(entry.gameId).to.be(demo.internal.gameId);
        expect(entry.reward.min >= 10000 && entry.reward.min <= 100000).to.be(true);
        expect(entry.reward.max >= 10000 && entry.reward.max <= 100000).to.be(true);
        expect(entry.reward.min <= entry.reward.max).to.be(true);
        if ((index + 1) % 4 === 0) {
          expect(entry.reward.min).to.be(entry.reward.max);
        } else {
          expect(entry.reward.min < entry.reward.max).to.be(true);
        }
        const duration = entry.schedule.end - entry.schedule.start;
        expect(duration >= 15 * 60 * 1000).to.be(true);
        expect(duration <= 30 * 60 * 1000).to.be(true);
        if (index > 0) {
          expect(entry.schedule.start.getTime()).to.be(entries[index - 1].schedule.end.getTime());
        }
      });
    });

    it('should cover a non-multiple-of-30-minute game without short challenges', async function () {
      const gameId = 'demo-challenges-65-minutes';
      try {
        await gplib.createDemoGameplay({gameId, gameStart: '06:00', gameEnd: '07:05', doNotNotifyMain: true});
        const demo = await gameplays.getGameplay(gameId, 'demo@ferropoly.ch');
        const entries = (await challenges.getChallenges(gameId))
          .sort((a, b) => a.schedule.start - b.schedule.start);
        const challengeEvents = await events.Model.find({gameId, reference: {$ne: null}}).lean().exec();

        expect(entries.length).to.be(3);
        expect(challengeEvents.length).to.be(entries.length * 3);
        expect(entries[0].schedule.start.getTime()).to.be(demo.scheduling.gameStartTs.getTime());
        expect(entries[2].schedule.end.getTime()).to.be(demo.scheduling.gameEndTs.getTime());
        entries.forEach((entry, index) => {
          const referenced = challengeEvents.filter(event => event.reference === entry._id);
          expect(referenced.length).to.be(3);
          for (const [type, timestamp] of [
            [CHALLENGE_START, entry.schedule.start],
            [CHALLENGE_HALF_TIME, halfTime(entry.schedule.start, entry.schedule.end)],
            [CHALLENGE_END, entry.schedule.end]
          ]) {
            const event = referenced.find(item => item.type === type);
            expect(event).to.be.ok();
            expect(event.timestamp.getTime()).to.be(timestamp.getTime());
          }
          const duration = entry.schedule.end - entry.schedule.start;
          expect(duration >= 15 * 60 * 1000).to.be(true);
          expect(duration <= 30 * 60 * 1000).to.be(true);
          if (index > 0) {
            expect(entry.schedule.start.getTime()).to.be(entries[index - 1].schedule.end.getTime());
          }
        });
      } finally {
        if (await gameplays.checkIfGameIdExists(gameId)) {
          await gplib.deleteGameplay({gameId, ownerEmail: 'demo@ferropoly.ch', doNotNotifyMain: true});
        }
      }
    });
  });

});

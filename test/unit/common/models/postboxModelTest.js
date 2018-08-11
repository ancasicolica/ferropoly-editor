/**
 * Testing the team model
 * Created by kc on 22.03.15.
 */
'use strict';

const expect   = require('expect.js');
const postbox  = require('./../../../../common/models/postboxModel');
const settings = require('./../../../../editor/settings');
const db       = require('./../../../../common/lib/ferropolyDb');


describe('TeamModel Tests', function () {
  before(function (done) {
    db.init(settings, function (err) {
      done(err);
    });
  });

  // Close DB afterwards and delete all teams
  after(function (done) {
    postbox.deleteAllEntries('test-game', function (err) {
      if (err) {
        console.error(err);
      }
      db.close(done);
    });
  });

  describe('Create a new message FROM a team', function () {
    it('should create one', function (done) {
      postbox.createMessage('test-game', {
          teamId  : 'sender-team-id',
          email   : 'sender@email.con',
          name    : 'Vorname Nachname',
          position: {
            lat     : -22,
            lng     : 42,
            accuracy: 200
          }
        },
        {
          id: 'reception'
        }
        ,
        {
          text: 'hello world'
        }
        ,

        (err, message) => {

          done(err);
        })
    });
  });

  describe('Create a new message TO a team', function () {
    it('should create one', function (done) {
      postbox.createMessage('test-game', {
          teamId  : 'reception',
          email   : 'sender@email.con',
          name    : 'Vorname Nachname',
          position: {
            lat     : -22,
            lng     : 42,
            accuracy: 200
          }
        },
        {
          id: 'sender-team-id'
        },
        {
          text: 'hello team'
        },
        (err, message) => {

          done(err);
        })
    });
  });
  describe('Get both messages again', function () {
    it('should get one', function (done) {
      postbox.getMessages('test-game', 'sender-team-id', {limit: 2},

        (err, messages) => {
          console.log(messages);
          expect(messages.length).to.be(2)
          done(err);
        })
    });
  });
  describe('Get only the first message again', function () {
    it('should get one', function (done) {
      postbox.getMessages('test-game', 'sender-team-id', {limit: 2, skip: 1},

        (err, messages) => {
          console.log(messages);
          expect(messages.length).to.be(1)
          done(err);
        })
    });
  });
});
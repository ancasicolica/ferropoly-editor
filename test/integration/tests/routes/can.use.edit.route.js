/**
 * Tests the edit route
 * Created by christian on 27.02.17.
 */

const expect         = require('expect.js');
const needle         = require('needle');
const settings       = require('../../fixtures/settings');
const logout         = require('../../routes/logout');
const createGame     = require('../../sequences/createGame');
const deleteAllGames = require('../../sequences/deleteAllGames');
const gameplay       = require('../../routes/gameplay');
const _              = require('lodash');
const admins         = require('../../routes/admins');

const admin1 = 'demo@ferropoly.ch';
const admin2 = 'nobody@ferropoly.ch';
const admin3 = 'team3@ferropoly.ch';
const admin4 = 'team9@ferropoly.ch';

describe('/admins route test', function () {
  let gameId  = '';
  let session = {};

  before(function (done) {
    this.timeout(10000);
    deleteAllGames(err => {
      if (err) {
        return done(err);
      }
      createGame({random: 20}, (err, res) => {
        if (err) {
          return done(err);
        }
        gameId  = res.gameId;
        session = res.session;
        logout(done);
      });
    });
  });

  after(done => {
    logout(done);
  });
  describe('Loading the HTML page', () => {
    it('should not work without being logged in', done => {
      needle.get(settings.host.url + `/admins/edit/${gameId}`, {}, (err, resp) => {
        expect(resp.statusCode).to.be(401);
        done(err);
      });
    });

    it('should work after being logged in', done => {
      require('../../routes/login')(settings, (err, session) => {
        if (err) {
          return done(err);
        }
        needle.get(settings.host.url + `/admins/edit/${gameId}`, {cookies: session.cookies}, (err, resp) => {
          expect(resp.statusCode).to.be(200);
          done(err);
        });
      });
    });
  });

  describe('Setting admins', () => {
    it('should have no admins now', done => {
      admins.get(session, {gameId}, (err, admins) => {
        expect(admins.length).to.be(0);
        done(err);
      });
    });
    it('should set 3 admins (of 4)', done => {
      admins.save(session, {
        gameId,
        logins: [admin1, admin2, admin3, admin4]
      }, (err, admins) => {
        console.log(admins);
        // only known users are returned
        expect(admins.result[admin1].personalData).to.be.a('object');
        expect(admins.result[admin3].personalData).to.be.a('object');
        done(err);
      });
    });
    it('should have 3 admins now', done => {
      admins.get(session, {gameId}, (err, admins) => {
        console.log(admins);
        expect(_.indexOf(admins, admin1) > -1).to.be(true);
        expect(_.indexOf(admins, admin2) > -1).to.be(true);
        expect(_.indexOf(admins, admin3) > -1).to.be(true);
        expect(admins.length).to.be(3);
        done(err);
      });
    });
  });

  describe('Negative tests for admin', () => {
    it('should fail with wrong token', done => {
      admins.save({accessToken: '1234'},
        {
          gameId, expectedStatusCode: 401,
          logins                    : [admin1, admin2, admin3, admin4]
        }, (err, admins) => {
          console.log(admins);
          done(err);
        });
    });
    it('post should fail with invalid game', done => {
      admins.save(session,
        {
          gameId: 'dont-know', expectedStatusCode: 500,
          logins                                 : [admin1, admin2, admin3, admin4]
        }, (err, admins) => {
          console.log(admins);
          done(err);
        });
    });
    it('get should fail with invalid game', done => {
      admins.get(session,
        {
          gameId: 'dont-know', expectedStatusCode: 500,
          logins                                 : [admin1, admin2, admin3, admin4]
        }, (err, admins) => {
          console.log(admins);
          done(err);
        });
    });
  });

});
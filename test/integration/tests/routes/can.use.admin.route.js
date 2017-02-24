/**
 * Testing the account route
 * Created by christian on 24.02.17.
 */
const expect              = require('expect.js');
const needle              = require('needle');
const settings            = require('../../fixtures/settings');
const logout              = require('../../routes/logout');
const createFinalizedGame = require('../../sequences/createFinalizedGame');
const gameplay            = require('../../routes/gameplay');
const _                   = require('lodash');

describe('/admins route test', function () {
  let gameId  = '';
  let session = {};

  before(function (done) {
    this.timeout(10000);
    createFinalizedGame({}, (err, res) => {
      if (err) {
        return done(err);
      }
      gameId  = res.gameId;
      session = res.session;
      logout(done);
    });

  });

  after(done => {
    gameplay.delete(session, {gameId}, err => {
      if (err) {
        return done(err);
      }
      logout(done);
    });
  });

  it('should not work without being logged in', done => {
    needle.get(settings.host.url + `/admins/edit/${gameId}`, {}, (err, resp) => {
      expect(resp.statusCode).to.be(401);
      done(err);
    });
  });

  it('should  work after being logged in', done => {
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
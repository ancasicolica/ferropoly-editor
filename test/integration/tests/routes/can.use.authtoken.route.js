/**
 * Testing auth-tokens
 * Created by christian on 27.02.17.
 */
const expect              = require('expect.js');
const needle              = require('needle');
const settings            = require('../../fixtures/settings');
const logout              = require('../../routes/logout');
const createFinalizedGame = require('../../sequences/createFinalizedGame');
const deleteAllGames      = require('../../sequences/deleteAllGames');
const _                   = require('lodash');
const admins              = require('../../routes/admins');
const debug               = require('../../routes/debug');


describe('/authtoken route test', () => {
  before(function (done) {
    debug(__filename, done);
  });

  after(done => {
    logout(done);
  });

  it('should refuse the token without login', done => {
    needle.get(settings.host.url + '/authtoken', {}, (err, resp) => {
      // Not logged in -> forward to login page
      switch (resp.statusCode) {
        case 302:
        case 401:
          break;

        default:
          expect().fail('Invalid status code: ' + resp.statusCode);
      }
      done(err);
    });
  });

  it('should return a valid authtoken', done => {
    // Login
    needle.post(settings.host.url + '/login',
      {
        username: _.get(settings, 'login.user', 'team16@ferropoly.ch'),
        password: _.get(settings, 'login.password', '12345678')
      },
      function (err, resp) {
        expect(resp.statusCode, 302).to.be(302);
        expect(resp.headers.location).not.to.be('/login');

        let cookies = _.get(resp, 'cookies', {});

        // Get the authToken
        needle.get(settings.host.url + '/authtoken', {cookies: cookies}, (err, resp) => {
          expect(resp.body.authToken.length).to.be(36);

          done(err);
        });
      });
  });

});
/**
 * Testing the account route
 * Created by christian on 24.02.17.
 */
const expect   = require('expect.js');
const needle   = require('needle');
const settings = require('../../fixtures/settings');
const logout   = require('../../routes/logout');

describe.only('/account route test', function () {
  before(function (done) {
    logout(settings, done);
  });

  after(done => {
    logout(settings, done);
  });

  it('should not work without being logged in', done => {
    needle.get(settings.host.url + '/account', {}, (err, resp) => {
      expect(resp.statusCode).to.be(401);
      done(err);
    });
  });

  it('should  work after being logged in', done => {
    require('../../routes/login')(settings, (err, session) => {
      if (err) {
        return done(err);
      }
      needle.get(settings.host.url + '/account', {cookies: session.cookies}, (err, resp) => {
        expect(resp.statusCode).to.be(200);
        done(err);
      });
    });
  });

});
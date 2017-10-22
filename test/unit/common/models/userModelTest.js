/**
 * Created by kc on 15.01.15.
 */

const expect   = require('expect.js');
const users    = require('./../../../../common/models/userModel');
const settings = require('./../../../../editor/settings');
const db       = require('./../../../../common/lib/ferropolyDb');
describe('UserModel Tests', function () {
  before(function (done) {
    db.init(settings, function (err) {
      done(err);
    });
  });

  // Close DB afterwards
  after(function (done) {
    db.close(done);
  });

  var user = new users.Model();

  describe('Generating a new password hash', function () {
    it('should create it', function () {
      users.generatePasswordHash(user, 'taibika');
      console.log(user.passwordHash);
      console.log(user.passwordSalt);
      expect(user.login.passwordHash.length > 60).to.be(true);
      expect(user.login.passwordSalt.length).to.be(64);
    });
  });

  describe('Verifiying the password', function () {
    it('with correct password should succeed', function () {
      expect(users.verifyPassword(user, 'taibika')).to.be(true);
    });
    it('with incorrect password should fail', function () {
      expect(users.verifyPassword(user, 'Taibika')).to.be(false);
    });
    it('with correct password but manipulated has should fail', function () {
      var originalHash        = user.login.passwordHash;
      user.login.passwordHash = '31963ada680a676def6dfe00989104858b7c3471835ffd639a38ea60fa42bda8';
      expect(users.verifyPassword(user, 'taibika')).to.be(false);
      user.login.passwordHash = originalHash;
      expect(users.verifyPassword(user, 'taibika')).to.be(true);
    })
  });

  describe('Updating the password hash', function () {
    it('should create a new hash', function () {
      var originalHash = user.passwordHash;
      users.generatePasswordHash(user, 'taibika');
      expect(users.verifyPassword(user, 'taibika')).to.be(true);
      expect(originalHash).to.not.be(user.login.passwordHash);
    })
  });

  describe('Updating / creating', function () {
    var user1          = new users.Model({
      personalData: {
        surname : 'Kunz',
        forename: 'Olivia',
        email   : 'olivia@gm-x.ch'
      }
    });
    user1.roles.editor = true;
    var password1      = 'erstfeld';

    describe('Removing user 1', function () {
      it('should work if it exits', function (done) {
        users.removeUser(user1.personalData.email, function (err) {
          console.log('Result:');
          console.log(err);
          done();
        });
      });
    });

    describe('Tests with user 1', function () {
      it('Adding the user should work', function (done) {
        users.updateUser(user1, password1, function (err, savedUser) {
          if (err) {
            done(err);
          }
          expect(savedUser.personalData.surname).to.be(user1.personalData.surname);
          expect(savedUser.personalData.forename).to.be(user1.personalData.forename);
          expect(savedUser.personalData.email).to.be(user1.personalData.email);
          expect(savedUser.roles.editor).to.be(true);
          expect(savedUser.roles.admin).to.be(false);
          expect(savedUser.login.passwordHash.length > 60).to.be(true);
          expect(savedUser.login.passwordSalt.length).to.be(64);
          expect(users.verifyPassword(savedUser, password1)).to.be(true);
          user1 = savedUser;
          done();
        })
      });
    });

    it('Changing a users parameter should work', function (done) {
      users.getUserByMailAddress('olivia@gm-x.ch', function (err, foundUser) {
        if (err) {
          done(err);
        }
        foundUser.personalData.surname = 'Huber-Kunz';
        users.updateUser(foundUser, null, function (err, savedUser) {
          if (err) {
            done(err);
          }
          expect(savedUser.personalData.surname).to.be('Huber-Kunz');
          expect(savedUser.personalData.forename).to.be('Olivia');
          expect(users.verifyPassword(savedUser, password1)).to.be(true);
          done();
        });
      });
    });

    it('Checking if the user exists should work', function (done) {
      users.getUserByMailAddress('olivia@gm-x.ch', function (err, user) {
        if (err) {
          done(err);
        }
        expect(user.personalData.email).to.be('olivia@gm-x.ch');
        done(err);
      })
    });

    it('Checking if an unkown exists should return none', function (done) {
      users.getUserByMailAddress('olivia@kunz-huber.ch', function (err, user) {
        if (err) {
          done(err);
        }
        expect(user).to.be(undefined);
        done(err);
      })
    });
  });

  var nb = 0;
  describe('Getting all users', function () {
    it('should return some', function (done) {
      users.getAllUsers(function (err, users) {
        nb = users.length;
        expect(nb >= 2).to.be(true);
        done(err);
      });
    })
  });

  describe('Count all users', function () {
    it('should return some', function (done) {
      users.countUsers(function (err, userNb) {
        expect(userNb).to.be(nb);
        done(err);
      });
    })
  });
});

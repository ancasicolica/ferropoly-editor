/**
 * Created by kc on 15.01.15.
 */

const expect   = require('expect.js');
const users    = require('./../../../../common/models/userModel');
const settings = require('./../../../../editor/settings');
const db       = require('./../../../../common/lib/ferropolyDb');

describe('UserModel Tests', function () {
  before(async function () {
    await db.init(settings);
  });

  // Close DB afterwards
  after(async function () {
    await db.close();
  });

  let user = new users.Model();

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
      let originalHash        = user.login.passwordHash;
      user.login.passwordHash = '31963ada680a676def6dfe00989104858b7c3471835ffd639a38ea60fa42bda8';
      expect(users.verifyPassword(user, 'taibika')).to.be(false);
      user.login.passwordHash = originalHash;
      expect(users.verifyPassword(user, 'taibika')).to.be(true);
    })
  });

  describe('Updating the password hash', function () {
    it('should create a new hash', function () {
      let originalHash = user.passwordHash;
      users.generatePasswordHash(user, 'taibika');
      expect(users.verifyPassword(user, 'taibika')).to.be(true);
      expect(originalHash).to.not.be(user.login.passwordHash);
    })
  });

  describe('Updating / creating', function () {
    let user1          = new users.Model({
      personalData: {
        surname:  'Kunz',
        forename: 'Olivia',
        email:    'olivia@gm-x.ch'
      }
    });
    user1.roles.editor = true;
    let password1      = 'erstfeld';

    describe('Removing user 1', function () {
      it('should work if it exits', async function () {
        await users.removeUser(user1.personalData.email);
      });
    });

    describe('Tests with user 1', function () {
      it('Adding the user should work', async function () {
        const savedUser = await users.updateUser(user1, password1);
        expect(savedUser.personalData.surname).to.be(user1.personalData.surname);
        expect(savedUser.personalData.forename).to.be(user1.personalData.forename);
        expect(savedUser.personalData.email).to.be(user1.personalData.email);
        expect(savedUser.roles.editor).to.be(true);
        expect(savedUser.roles.admin).to.be(false);
        expect(savedUser.login.passwordHash.length > 60).to.be(true);
        expect(savedUser.login.passwordSalt.length).to.be(64);
        expect(users.verifyPassword(savedUser, password1)).to.be(true);
        user1 = savedUser;
      });
    });

    it('Changing a users parameter should work', async function () {
      const foundUser                = await users.getUserByMailAddress('olivia@gm-x.ch')
      foundUser.personalData.surname = 'Huber-Kunz';
      const savedUser                = await users.updateUser(foundUser, null);
      expect(savedUser.personalData.surname).to.be('Huber-Kunz');
      expect(savedUser.personalData.forename).to.be('Olivia');
      expect(users.verifyPassword(savedUser, password1)).to.be(true);
    });
  });

  it('Checking if the user exists should work', async function () {
    const user = await users.getUserByMailAddress('olivia@gm-x.ch');
    expect(user.personalData.email).to.be('olivia@gm-x.ch');
  });

  it('Checking if an unkown exists should return none', async function () {
    const user = await users.getUserByMailAddress('olivia@kunz-huber.ch');
    expect(user).to.be(undefined);
  });


  let nb = 0;
  describe('Getting all users', function () {
    it('should return some', async function () {
      const res = await users.getAllUsers();
      nb = res.length;
      expect(nb >= 2).to.be(true);
    })
  });


  describe('Getting one user', function () {
    it('should return one', async function () {
      const user = await users.getUser('olivia@gm-x.ch');
      console.log(user);
    })
  });

  describe('Count all users', function () {
    it('should return some', async function () {
      const userNb = await users.countUsers()
      expect(userNb).to.be(nb);
    })
  });

});

/**
 * Demo users for Ferropoly
 * Created by kc on 06.01.16.
 */

const users                  = require('../../common/models/userModel');
const gravatar               = require('../../common/lib/gravatar');
const {getUserByMailAddress} = require('../../common/models/userModel');
const logger                 = require('../../common/lib/logger').getLogger('demoUsers');

const demoUsers = [
  {forename: 'Heinz', surename: 'Muster', email: 'demo@ferropoly.ch'},
  {forename: 'Nora', surename: 'Reichle', email: 'team1@ferropoly.ch'},
  {forename: 'Marius', surename: 'Garatti', email: 'team2@ferropoly.ch'},
  {forename: 'Sylvia', surename: 'Balmer', email: 'team3@ferropoly.ch'},
  {forename: 'Jonas', surename: 'Tobler', email: 'team4@ferropoly.ch'},
  {forename: 'Christine', surename: 'Huber', email: 'team5@ferropoly.ch'},
  {forename: 'Martin', surename: 'Schiess', email: 'team6@ferropoly.ch'},
  {forename: 'Lea', surename: 'Kuster', email: 'team7@ferropoly.ch'},
  {forename: 'Thomas', surename: 'Kunz', email: 'team8@ferropoly.ch'},
  {forename: 'Bianca', surename: 'Meier', email: 'team9@ferropoly.ch'},
  {forename: 'Linus', surename: 'Wolfensberger', email: 'team10@ferropoly.ch'},
  {forename: 'Olivia', surename: 'Osterwalder', email: 'team11@ferropoly.ch'},
  {forename: 'Simon', surename: 'Rotach', email: 'team12@ferropoly.ch'},
  {forename: 'Brigitte', surename: 'Buttex', email: 'team13@ferropoly.ch'},
  {forename: 'Daniel', surename: 'Häberling', email: 'team14@ferropoly.ch'},
  {forename: 'Franziska', surename: 'Ochsner', email: 'team15@ferropoly.ch'},
  {forename: 'Bernhard', surename: 'Spiegelberg', email: 'team16@ferropoly.ch'},
  {forename: 'Claudia', surename: 'Ruckli', email: 'team17@ferropoly.ch'},
  {forename: 'Richard', surename: 'Droost', email: 'team18@ferropoly.ch'},
  {forename: 'Nicole', surename: 'Signer', email: 'team19@ferropoly.ch'},
  {forename: 'Stefan', surename: 'Heinzmann', email: 'team20@ferropoly.ch'},
  {forename: 'Esther', surename: 'Isler', email: 'team21@ferropoly.ch'},
  {forename: 'Adriano', surename: 'Baraldo', email: 'team22@ferropoly.ch'},
  {forename: 'Annina', surename: 'Michels', email: 'team23@ferropoly.ch'},
  {forename: 'Peter', surename: 'Joss', email: 'team24@ferropoly.ch'},
  {forename: 'Jeanette', surename: 'Meyer', email: 'team25@ferropoly.ch'},
  {forename: 'Silvan', surename: 'Rümeli', email: 'team26@ferropoly.ch'},
  {forename: 'Yvonne', surename: 'Eigenmann', email: 'team27@ferropoly.ch'},
  {forename: 'Urs', surename: 'Alessi', email: 'team28@ferropoly.ch'},
  {forename: 'Denise', surename: 'Dütschler', email: 'team29@ferropoly.ch'},
  {forename: 'Cyrill', surename: 'Looser', email: 'team30@ferropoly.ch'}
];

module.exports = {

  /**
   * Returns the full name of the teamleader
   * @param index
   * @returns {string}
   */
  getTeamLeaderName: function (index) {
    return demoUsers[1 + index].forename + ' ' + demoUsers[1 + index].surename;
  },

  /**
   * Returns the email address of the team leader
   * @param index
   * @returns {*}
   */
  getTeamLeaderEmail: function (index) {
    return demoUsers[1 + index].email;
  },

  /**
   * Updates (creates if needed) the logins for the users.
   * @param callback
   */
  updateLogins: async function (callback) {
    if (callback) {
      logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in updateLogins is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
      return callback('NOT SUPPORTED ANYMORE!');
    }

    try {
      for (const u of demoUsers) {
        const foundUser = await getUserByMailAddress(u.email);
        if (foundUser) {
          foundUser.personalData.forename = u.forename;
          foundUser.personalData.surname  = u.surename;
          foundUser.personalData.email    = u.email;
          foundUser.personalData.avatar   = gravatar.getUrl(u.email);
          foundUser.login.verifiedEmail   = true;
          await users.updateUser(foundUser, '12345678');
        }
      }
    }
    catch (err) {
      logger.error('Problem in updateLogins', err);
    }
  }
};

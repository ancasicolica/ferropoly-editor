/**
 * Demo users for Ferropoly
 * Created by kc on 06.01.16.
 */

const users                  = require('../../common/models/userModel');
const gravatar               = require('../../common/lib/gravatar');
const logger                 = require('../../common/lib/logger').getLogger('demoUsers');

const demoUsers = [
  {forename: 'Heinz', surname: 'Muster', email: 'demo@ferropoly.ch'},
  {forename: 'Nora', surname: 'Reichle', email: 'team1@ferropoly.ch'},
  {forename: 'Marius', surname: 'Garatti', email: 'team2@ferropoly.ch'},
  {forename: 'Sylvia', surname: 'Balmer', email: 'team3@ferropoly.ch'},
  {forename: 'Jonas', surname: 'Tobler', email: 'team4@ferropoly.ch'},
  {forename: 'Christine', surname: 'Huber', email: 'team5@ferropoly.ch'},
  {forename: 'Martin', surname: 'Schiess', email: 'team6@ferropoly.ch'},
  {forename: 'Lea', surname: 'Kuster', email: 'team7@ferropoly.ch'},
  {forename: 'Thomas', surname: 'Kunz', email: 'team8@ferropoly.ch'},
  {forename: 'Bianca', surname: 'Meier', email: 'team9@ferropoly.ch'},
  {forename: 'Linus', surname: 'Wolfensberger', email: 'team10@ferropoly.ch'},
  {forename: 'Olivia', surname: 'Osterwalder', email: 'team11@ferropoly.ch'},
  {forename: 'Simon', surname: 'Rotach', email: 'team12@ferropoly.ch'},
  {forename: 'Brigitte', surname: 'Buttex', email: 'team13@ferropoly.ch'},
  {forename: 'Daniel', surname: 'Häberling', email: 'team14@ferropoly.ch'},
  {forename: 'Franziska', surname: 'Ochsner', email: 'team15@ferropoly.ch'},
  {forename: 'Bernhard', surname: 'Spiegelberg', email: 'team16@ferropoly.ch'},
  {forename: 'Claudia', surname: 'Ruckli', email: 'team17@ferropoly.ch'},
  {forename: 'Richard', surname: 'Droost', email: 'team18@ferropoly.ch'},
  {forename: 'Nicole', surname: 'Signer', email: 'team19@ferropoly.ch'},
  {forename: 'Stefan', surname: 'Heinzmann', email: 'team20@ferropoly.ch'},
  {forename: 'Esther', surname: 'Isler', email: 'team21@ferropoly.ch'},
  {forename: 'Adriano', surname: 'Baraldo', email: 'team22@ferropoly.ch'},
  {forename: 'Annina', surname: 'Michels', email: 'team23@ferropoly.ch'},
  {forename: 'Peter', surname: 'Joss', email: 'team24@ferropoly.ch'},
  {forename: 'Jeanette', surname: 'Meyer', email: 'team25@ferropoly.ch'},
  {forename: 'Silvan', surname: 'Rümeli', email: 'team26@ferropoly.ch'},
  {forename: 'Yvonne', surname: 'Eigenmann', email: 'team27@ferropoly.ch'},
  {forename: 'Urs', surname: 'Alessi', email: 'team28@ferropoly.ch'},
  {forename: 'Denise', surname: 'Dütschler', email: 'team29@ferropoly.ch'},
  {forename: 'Cyrill', surname: 'Looser', email: 'team30@ferropoly.ch'}
];

module.exports = {

  /**
   * Returns the full name of the teamleader
   * @param index
   * @returns {string}
   */
  getTeamLeaderName: function (index) {
    return demoUsers[1 + index].forename + ' ' + demoUsers[1 + index].surname;
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
        let user = new users.Model();

        user.personalData.forename = u.forename;
        user.personalData.surname = u.surname;
        user.personalData.email = u.email;
        user.personalData.avatar =gravatar.getUrl(u.email);
         user.login.verifiedEmail = true;

        await users.updateUser(user, '12345678');
      }
    }
    catch (err) {
      logger.error('Problem in updateLogins', err);
    }
  }
};

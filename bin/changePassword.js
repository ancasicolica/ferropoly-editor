#!/usr/bin/env node
/*
 Updates a users password

 Parameters (all mandatory):
   --email
   --password
 */
const argv        = require('minimist')(process.argv.slice(2));
const settings    = require('../editor/settings');
const ferropolyDb = require('../common/lib/ferropolyDb');
const userModel   = require('../common/models/userModel');

if (!argv.email || !argv.password) {
  console.log("Please pass all needed parameters!");
  console.log("error");
  process.exit(code = -1);
}

ferropolyDb.init(settings, function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  userModel.getUserByMailAddress(argv.email, function (err, user) {
    if (err) {
      console.log('Error while getting user', err);
      process.exit(code = 0);
      return;
    }
    if (!user) {
      console.log('User "' + argv.email + '" not found');
      process.exit(code = 0);
      return;
    }
    userModel.updateUser(user, `${argv.password}`, function (err) {
      if (err) {
        console.log('User update error: ' + err);
        process.exit(code = 0);
        return;
      }
      console.log('OK');
      process.exit(code = 0);
    })
  });
});

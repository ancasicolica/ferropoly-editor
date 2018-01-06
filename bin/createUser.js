#!/usr/bin/env node
/*
 Creates a new user

 Parameters (all mandatory):
   --forename
   --surename
   --email
   --password
 */
const argv        = require('minimist')(process.argv.slice(2));
const settings    = require('../editor/settings');
const ferropolyDb = require('../common/lib/ferropolyDb');
const userModel   = require('../common/models/userModel');

if (!argv.surname || !argv.forename || !argv.email || !argv.password) {
  console.log("Please pass all needed parameters!");
  console.log("error");
  process.exit(code = -1);
}

let newUser = new userModel.Model({
  _id         : argv.email,
  personalData: {
    surname : argv.surname,
    forename: argv.forename,
    email   : argv.email
  },
  info        : {
    registrationDate: new Date()
  },
  roles       : {
    editor: true
  },
  login       : {verifiedEmail: true}
});

console.log('Creating user:', newUser);

ferropolyDb.init(settings, function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  userModel.updateUser(newUser, argv.password, function (err) {
    if (err) {
      console.log('User creation error: ' + err);
      process.exit(code = 0);
      return;
    }
    console.log('OK');
    process.exit(code = 0);
  })
});

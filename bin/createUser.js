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
  console.log('Please pass all needed parameters!');
  console.log('error');
  process.exit(code = -1);
}

let newUser = new userModel.Model({
  _id:          argv.email,
  personalData: {
    surname:  argv.surname,
    forename: argv.forename,
    email:    argv.email
  },
  info:         {
    registrationDate: new Date()
  },
  roles:        {
    editor: true
  },
  login:        {verifiedEmail: true}
});

console.log('Creating user:', newUser);

async function main() {
  try {
    await ferropolyDb.init(settings);
    await userModel.updateUser(newUser, argv.password.toString());

    await ferropolyDb.close();
    console.log('OK');
    process.exit(code = 0);
  }
  catch(err) {
    console.error(err);
    process.exit(code = -1);
  }
}

main();

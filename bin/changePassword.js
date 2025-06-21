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
  console.log('Please pass all needed parameters!');
  console.log('error');
  process.exit(code = -1);
}

ferropolyDb.init(settings, async function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  const user = await userModel.getUserByMailAddress(argv.email);
  if (!user) {
    console.log('User "' + argv.email + '" not found');
    process.exit(code = 0);
    return;
  }
  await userModel.updateUser(user, `${argv.password}`);
  console.log('OK');
  process.exit(code = 0);

});

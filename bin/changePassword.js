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

async function main() {
  try {
    await ferropolyDb.init(settings);

    const user = await userModel.getUserByMailAddress(argv.email);
    if (!user) {
      console.log('User "' + argv.email + '" not found');
      process.exit(code = 0);
      return;
    }
    await userModel.updateUser(user, `${argv.password}`);
    await ferropolyDb.close();
    console.log('OK');
    process.exit(code = 0);

  }
  catch (err) {
    console.error(err);
    process.exit(code = -1);
  }
}

main();

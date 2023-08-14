#!/usr/bin/env node
/**
 * Builds the config of the webapp
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 06.06.21
 **/
const fs = require('fs');
const path = require('path');
let config = {
  googleApiKey : process.env.FERROPOLY_GOOGLE_API_KEY || 'no-key-so-far'
};


fs.writeFileSync(path.join(__dirname, '..','editor','webapp', 'webapp_config.json'), JSON.stringify(config));


// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

Sentry.init({
  dsn: process.env.FERROPOLY_SENTRY_NODE_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

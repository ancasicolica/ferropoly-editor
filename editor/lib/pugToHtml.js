/**
 * Function converting a pug file to HTML
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 22.02.2025
 **/

const pug = require('pug');
const _ = require('lodash');

module.exports = function(pugText) {
  // Remove newlines, the editor does not like them
  let html = pug.render(pugText, {});
  html     = _.replace(html, /\n/g, ' ');
  return html;
}

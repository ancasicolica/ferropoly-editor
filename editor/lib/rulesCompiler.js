/**
 * Compiles the rules to a readable version
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 24.02.2025
 **/

const translation = require('./rulesTranslation.json');
const _           = require('lodash');
const {DateTime}  = require('luxon');

function formatAmount(amount) {
  return amount.toLocaleString('de-CH');
}

/**
 * The time can be a string in ISO format: "2025-02-24T04:00:00.000Z" or only "04:00" (
 * (after finalization)
 * @param time
 */
function formatGameTime(time) {
  if (time.length < 10) {
    return time;
  }
  let date = DateTime.fromISO(time);
  return date.toLocaleString(DateTime.TIME_24_SIMPLE);
}

function formatGameDate(date) {
  console.log('XXX', date);
  return  DateTime.fromJSDate(date).setLocale('de').toLocaleString(DateTime.DATE_HUGE);
}

module.exports = function (options) {
  if (!options.gp || !options.raw) {
    return;
  }

  let raw = options.raw;

  translation.forEach(t => {
    let formatter;
    if (t.formatter) {
      if (t.formatter === 'formatAmount') {
        formatter = formatAmount;
      } else if (t.formatter === 'gameTime') {
        formatter = formatGameTime;
      }else if (t.formatter === 'gameDate') {
        formatter = formatGameDate;
      }
    } else {
      formatter = function (e) {
        return e;
      };
    }
    raw = _.replace(raw, new RegExp(`{{\\s?${_.escapeRegExp(t.tag)}\\s?}}`, 'gi'), formatter(_.get(options.gp, t.property)));
  })

  return raw;
}

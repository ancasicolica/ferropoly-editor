import {DateTime} from "luxon";
import {isNumber} from "lodash";


/**
 * Formatter for the Game Date (when we play):
 *
 * Sonntag, 11. April 2021
 *
 * @param value
 * @returns {string}
 */
function formatGameDate(value) {
  if (!value) {
    return '';
  }
  return DateTime.fromISO(value).toLocaleString(DateTime.DATE_HUGE);
}

/**
 * Formatter for the Date and time when the price list was created:
 *
 * 10. Apr. 2021, 10:09
 *
 * @param value
 * @returns {string}
 */
function formatDateTime(value) {
  if (!value) {
    return '';
  }
  return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED);
}

/**
 * Formats the price with the 1'000 format
 * @param val
 * @returns {string|*}
 */
function formatPrice(val) {
  if (isNumber(val)) {
    return val.toLocaleString('de-CH');
  }
  return val;
}

export {formatGameDate, formatDateTime, formatPrice}

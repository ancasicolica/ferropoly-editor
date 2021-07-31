import {DateTime} from 'luxon';
import {isNumber} from 'lodash';


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

/**
 * Formatter for "how can a property be accessed?"
 * @param val
 * @returns {string}
 */
function formatAccessibility(val) {
  switch (val) {
    case 'train':
      return 'Bahn';

    case 'bus':
      return 'Bus';

    case 'boat':
      return 'Schiff';

    case 'cablecar':
      return 'Seilbahn / Standseilbahn';

    default:
      return 'Andere (Tram, U-Bahn,...)';
  }
}

/**
 * Formats the price range of a property
 * @param val
 * @returns {string}
 */
function formatPriceRange(val) {
  switch (val) {
    case -1:
      return 'unbenutzt';

    case 0:
      return 'sehr billig';

    case 1:
      return 'billig';

    case 2:
      return 'unt. Mittelf.';

    case 3:
      return 'ob. Mittelf.';

    case 4:
      return 'teuer';

    case 5:
      return 'sehr teuer';

    default:
      return '?';
  }
}

export {formatGameDate, formatDateTime, formatPrice, formatAccessibility, formatPriceRange};

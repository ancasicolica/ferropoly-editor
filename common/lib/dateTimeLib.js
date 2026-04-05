/**
 * Things around date and time luxon could not fix
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 16.04.23
 **/

const _          = require('lodash');
const {DateTime} = require('luxon');

module.exports = {

  /**
   * Returns a JS Time object, no matter if a luxon, string od JS date was supplied. NULL and UNDEFINED
   * keep their value
   * @param t
   */
  getJsDate: function (t) {
    if (t instanceof DateTime) {
      return t.toJSDate();
    }
    if (_.isString(t)) {
      let d = DateTime.fromISO(t).toJSDate();
      if (!d.isValid) {
        d = DateTime.fromRFC2822(t).toJSDate();
      }
      if (!d.isValid) {
        d = DateTime.fromSQL(t).toJSDate();
      }
      if (!d.isValid) {
        d = DateTime.fromHTTP(t).toJSDate();
      }
      if(!d.isValid) {
        d = DateTime.fromJSDate(new Date(t)).toJSDate();
      }
      return d;
    }
    if (_.isInteger(t)) {
      return DateTime.fromMillis(t).toJSDate();
    }
    return t;
  }

}

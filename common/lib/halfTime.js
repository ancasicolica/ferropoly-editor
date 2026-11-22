/**
 * A function calculating the half time between two timestamps
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 22.11.2026
 **/

/**
 * Calculates the mid of two timestamps
 * @param start
 * @param end
 * @return {Date}
 */
module.exports = function(start, end) {
  if (!(start instanceof Date)) start = new Date(start);
  if (!(end instanceof Date)) end = new Date(end);
  const middle = (start.getTime() + end.getTime()) / 2;
  return new Date(Math.round(middle / 60000) * 60000);
}

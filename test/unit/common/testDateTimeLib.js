/**
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 16.04.23
 **/

const expect     = require('expect.js');
const moment     = require('moment');
const {DateTime} = require('luxon');
const lib = require('../../../common/lib/dateTimeLib');
describe('DateTimeLib Tests', () => {

  describe('Converting dates', () => {
    it('should work with moment object', () => {
      const date = lib.getJsDate(moment());
      console.log(date);
      expect(date instanceof Date).to.be(true);
    });
    it('should work with luxon object', () => {
      const date = lib.getJsDate(DateTime.now());
      console.log(date);
      expect(date instanceof Date).to.be(true);
    });
    it('should work with JS Date object', () => {
      const date = lib.getJsDate(Date());
      console.log(date);
      expect(date instanceof Date).to.be(true);
    });
    it('should work with JS Date object as constructor', () => {
      const date = lib.getJsDate(new Date());
      console.log(date);
      expect(date instanceof Date).to.be(true);
    });
    it('should work with timestamp', () => {
      const date = lib.getJsDate(Date.now());
      console.log(date);
      expect(date instanceof Date).to.be(true);
    });
  })

})

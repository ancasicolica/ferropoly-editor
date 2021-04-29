/**
 * Not a real test, just used for testing during development
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 29.04.21
 **/

const expect         = require('expect.js');
const rulesGenerator = require('../../../../editor/lib/rulesGenerator');
const gp             = require('./fixtures/gp.json');
const _              = require('lodash');
describe('Rules lib Tests', function () {
  it('should generate a html file', function () {
    let html = rulesGenerator(gp);
    console.log(html);
    expect(_.isString(html));
  });
})

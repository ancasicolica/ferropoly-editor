/**
 * Not a real test, just used for testing during development
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 29.04.21
 **/

const expect        = require('expect.js');
const rulesCompiler = require('../../../../editor/lib/rulesCompiler');

const gp   = require('./fixtures/gp.json');
const _    = require('lodash');
const fs   = require('fs');
const path = require('path');

let template = '';
describe('Rules lib Tests', function () {
  before(() => {
    const templateFile = path.join(__dirname, '../../../../editor/lib/rulesTemplate.pug');
    template           = fs.readFileSync(templateFile, 'utf8');
  })
  it('should generate a html file', function () {
    let html = rulesCompiler({gp, raw: template});
    console.log(html);
    expect(_.isString(html));
  });
})

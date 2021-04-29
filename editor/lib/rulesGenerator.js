/**
 * Ferropoly Rules Generator
 *
 * Created by kc on 17.05.16.
 */

const pug  = require('pug');
const fs   = require('fs')
const path = require('path');
const _    = require('lodash');

function formatAmount(amount) {
  return amount.toLocaleString('de-CH');
}

const replacements = [
  {e: 'scheduling.gameStart'},
  {e: 'scheduling.gameEnd'},
  {e: 'gameParams.startCapital', formatter: formatAmount},
  {e: 'gameParams.interest', formatter: formatAmount},
  {e: 'gameParams.interestInterval'},
  {e: 'gameParams.interestCyclesAtEndOfGame'},
  {e: 'gameParams.rentFactors.allPropertiesOfGroup'},
  {e: 'gameParams.chancellery.minLottery', formatter: formatAmount},
  {e: 'gameParams.chancellery.maxLottery', formatter: formatAmount},
  {e: 'gameParams.chancellery.maxGambling', formatter: formatAmount},
  {e: 'owner.organisatorPhone'},
]

module.exports = function (gp) {
  let template   = fs.readFileSync(path.join(__dirname, 'rulesTemplate.pug'), 'utf8');
  let pugOptions = {
    interestCyclesAtEndOfGame: gp.gameParams.interestCyclesAtEndOfGame > 0,
    organisatorPhoneKnown    : gp.owner.organisatorPhone && gp.owner.organisatorPhone.length > 6,
    mobileInfoAccess         : gp.mobile.level > 0
  }
  // Parse File with all replacements
  replacements.forEach(r => {
    if (!r.formatter) {
      r.formatter = function (e) {
        return e;
      };
    }
    template = _.replace(template, `$${r.e}$`, r.formatter(_.get(gp, r.e, '---ERROR!---')));
  });
  // Remove newlines, the editor does not like them
  let html = pug.render(template, pugOptions)
  html     = _.replace(html, /\n/g, ' ');
  return html;
}

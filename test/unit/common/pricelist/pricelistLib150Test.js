/**
 * Test for the pricelist, just with a focus for different priceslists
 *
 * The name 150 is for the bug causing this tests, with 150 elements there was a wrong calculation
 * Created by kc on 04.07.15.
 */
'use strict';

const expect = require('expect.js');
const pll    = require('../../../../editor/lib/pricelistlib');

let properties; // The faked properties
let ranges;
let pricelist;

describe('Pricelist lib 150 Tests', function () {
  before(function () {
    properties = [];
    for (let i = 0; i < 150; i++) {
      properties.push({
        location : {name: 'prop' + i},
        pricelist: {priceRange: i % 6, positionInPriceRange: 1000 / (i + 1)}
      })
    }
    ranges    = pll.extractRanges(properties);
    pricelist = pll.createPriceListArray(ranges);
  });

  describe('Calcluating the prices', function () {
    it('should work with a separate price for each property (with settings 1)', function () {
      let lp = 1000;
      let hp = 8000;
      let l  = pll.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 8,
            lowestPrice        : lp,
            highestPrice       : hp
          }
        }
      }, pricelist);
      expect(l[0].pricelist.price).to.be(lp);
      expect(l[30].pricelist.price).to.be(2000);
      expect(l[51].pricelist.price).to.be(3000);
      expect(l[100].pricelist.price).to.be(6000);
      expect(l[l.length - 2].pricelist.price).to.be(hp);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });
  });

  describe('Calcluating the prices', function () {
    it('should work with a separate price for each property (with settings 1)', function () {
      let lp = 1000;
      let hp = 8000;
      let l  = pll.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 32,
            lowestPrice        : lp,
            highestPrice       : hp
          }
        }
      }, pricelist);
      expect(l[0].pricelist.price).to.be(lp);
      expect(l[30].pricelist.price).to.be(2350);
      expect(l[51].pricelist.price).to.be(3250);
      expect(l[100].pricelist.price).to.be(5510);
      expect(l[l.length - 2].pricelist.price).to.be(hp);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });
  });
});

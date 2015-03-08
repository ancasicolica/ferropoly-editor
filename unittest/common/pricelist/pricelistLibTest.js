/**
 * This unit tests are for the pricelist in the lib WITHOUT DATABASE OR MODELS
 * Just testing the basic functionality
 * Created by kc on 08.03.15.
 */
'use strict';


var expect = require('expect.js');
var pll = require('../../../editor/lib/pricelist');

var properties; // The faked properties
var ranges;
var pricelist;

describe.only('Pricelist lib Tests', function () {
  before(function () {
    properties = [];
    for (var i = 0; i < 120; i++) {
      properties.push({
        location: {name: 'prop' + i},
        pricelist: {priceRange: i % 6, positionInPriceRange: 1000 / (i + 1)}
      })
    }
  });

  describe('Extracting the ranges from the properties', function() {
    it('should result in sorted price ranges', function() {
      ranges = pll.internal.extractRanges(properties);
      expect(ranges.length).to.be(6);

      for (var i = 0; i < 6; i++) {
        expect(ranges[i].length).to.be(20);
        // order inside price range ok?
        for (var t = 0; t < ranges[i].length - 1; t++) {
          expect(ranges[i][t].pricelist.positionInPriceRange < ranges[i][t + 1].pricelist.positionInPriceRange).to.be(true);
        }
      }
    })
  });

  describe('Concatenate all ranges to one list', function() {
    it('should create the pricelist in correct order', function() {
      pricelist = pll.internal.createPriceListArray(ranges);
      expect(pricelist.length).to.be(120);

      var z = 0;
      for (var i = 0; i < 6; i++) {
        for (var t = 0; t < ranges[i].length; t++) {
          expect(pricelist[z].location.name).to.be(ranges[i][t].location.name);
          expect(pricelist[z].pricelist.position).to.be(z);
          z++;
        }
      }
    });
  });


});

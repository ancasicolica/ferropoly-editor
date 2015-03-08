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

  describe('Extracting the ranges from the properties', function () {
    it('should result in sorted price ranges', function () {
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

  describe('Concatenate all ranges to one list', function () {
    it('should create the pricelist in correct order', function () {
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

  describe('Calcluating the prices', function () {
    it('should work with a separate price for each property (with settings 1)', function () {
      var lp = 1000;
      var hp = 8000;
      var l = pll.internal.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 1,
            lowestPrice: lp,
            highestPrice: hp
          }
        }
      }, pricelist);
      expect(l[0].pricelist.price).to.be(lp);
      expect(l[30].pricelist.price).to.be(2760);
      expect(l[51].pricelist.price).to.be(4000);
      expect(l[100].pricelist.price).to.be(6880);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });

    it('should work with a separate price for each property (with settings 2: min bounds)', function () {
      var lp = 100;
      var hp = 1000;
      var l = pll.internal.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 1,
            lowestPrice: lp,
            highestPrice: hp
          }
        }
      }, pricelist);
      expect(l[0].pricelist.price).to.be(lp);
      expect(l[30].pricelist.price).to.be(320);
      expect(l[51].pricelist.price).to.be(480);
      expect(l[100].pricelist.price).to.be(850);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });

    it('should work with a separate price for each property (with settings 3: max bounds)', function () {
      var lp = 100;
      var hp = 10000;
      var l = pll.internal.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 1,
            lowestPrice: lp,
            highestPrice: hp
          }
        }
      }, pricelist);

      expect(l[0].pricelist.price).to.be(lp);
      expect(l[30].pricelist.price).to.be(2590);
      expect(l[51].pricelist.price).to.be(4340);
      expect(l[100].pricelist.price).to.be(8410);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });

    it('should work with 2 price groups', function () {
      var lp = 1000;
      var hp = 8000;
      var l = pll.internal.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 2,
            lowestPrice: lp,
            highestPrice: hp
          }
        }
      }, pricelist);
      expect(l[0].pricelist.price).to.be(lp);
      expect(l[59].pricelist.price).to.be(1000);
      expect(l[60].pricelist.price).to.be(8000);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });

    it('should work with 4 price groups', function () {
      var lp = 1000;
      var hp = 8000;
      var l = pll.internal.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 4,
            lowestPrice: lp,
            highestPrice: hp
          }
        }
      }, pricelist);
      expect(l[0].pricelist.price).to.be(lp);
      expect(l[29].pricelist.price).to.be(1000);
      expect(l[30].pricelist.price).to.be(3330);
      expect(l[59].pricelist.price).to.be(3330);
      expect(l[60].pricelist.price).to.be(5660);
      expect(l[89].pricelist.price).to.be(5660);
      expect(l[90].pricelist.price).to.be(8000);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });

    it('should work with 8 price groups', function () {
      var lp = 1000;
      var hp = 8000;
      var l = pll.internal.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 8,
            lowestPrice: lp,
            highestPrice: hp
          }
        }
      }, pricelist);
      expect(l[0].pricelist.price).to.be(lp);
      expect(l[14].pricelist.price).to.be(1000);
      expect(l[30].pricelist.price).to.be(3000);
      expect(l[40].pricelist.price).to.be(3000);
      expect(l[50].pricelist.price).to.be(4000);
      expect(l[60].pricelist.price).to.be(5000);
      expect(l[89].pricelist.price).to.be(6000);
      expect(l[105].pricelist.price).to.be(8000);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });

    it('should work with 32 price groups (max)', function () {
      var lp = 1000;
      var hp = 8000;
      var l = pll.internal.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 32,
            lowestPrice: lp,
            highestPrice: hp
          }
        }
      }, pricelist);
      expect(l[0].pricelist.price).to.be(lp);
      expect(l[40].pricelist.price).to.be(3250);
      expect(l[50].pricelist.price).to.be(3700);
      expect(l[60].pricelist.price).to.be(4380);
      expect(l[89].pricelist.price).to.be(5960);
      expect(l[118].pricelist.price).to.be(7540);
      expect(l[l.length - 1].pricelist.price).to.be(hp);
    });
  });

  describe('Calculating house prices', function () {
    it('should work with the standard setting', function () {
      var lp = 1000;
      var hp = 8000;
      var l = pll.internal.setPropertyPrices({
        gameParams: {
          properties: {
            numberOfPriceLevels: 8,
            lowestPrice: lp,
            highestPrice: hp
          }
        }
      }, pricelist);

      l = pll.internal.setPropertyHousePricing({
        gameParams: {
          housePrices: 0.5, rentFactors: {
            noHouse: 0.125, oneHouse: 0.5, twoHouses: 2, threeHouses: 3, fourHouses: 4, hotel: 5
          }
        }
      }, l);

      expect(l[0].pricelist.pricePerHouse).to.be(500);
      expect(l[72].pricelist.pricePerHouse).to.be(2500);
      expect(l[119].pricelist.pricePerHouse).to.be(4000);
      expect(l[0].pricelist.rents.noHouse).to.be(120);
      expect(l[0].pricelist.rents.hotel).to.be(5000);
      expect(l[72].pricelist.rents.noHouse).to.be(620);
      expect(l[72].pricelist.rents.hotel).to.be(25000);
      expect(l[119].pricelist.rents.noHouse).to.be(1000);
      expect(l[119].pricelist.rents.hotel).to.be(40000);
    });
  });

});

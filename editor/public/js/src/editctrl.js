/**
 * Edit control
 * Created by kc on 05.02.15.
 */
'use strict';

/**********************************************************************************************************************/
var editControl = angular.module('editApp', ['ui.bootstrap', 'ui.sortable', 'ngSanitize', 'wiz.markdown']);
editControl.directive('convertToNumber', function () {
  return {
    require: 'ngModel',
    link   : function (scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function (val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function (val) {
        return '' + val;
      });
    }
  };
});
editControl.controller('editCtrl', ['$scope', '$http', '$interval', '$timeout', function ($scope, $http, $interval, $timeout) {

  $scope.panel               = 'init';
  $scope.gameplay            = {};
  $scope.allProperties       = [];
  $scope.markers             = [];
  $scope.displayedProperties = [];
  $scope.gameplayReadOnly    = {};
  $scope.statusText          = '';
  $scope.currentMarker       = undefined;
  $scope.propertyFilter      = 'all';
  $scope.propertiesPredicate = 'data.location.name';
  $scope.reverse             = false;

  $scope.nbPropertiesPerGroupOptions = [
    {name: '1', id: 1},
    {name: '2', id: 2},
    {name: '3', id: 3},
    {name: '4', id: 4}
  ];

  $scope.numberOfPriceLevelsOptions = [
    {name: '1', id: 1},
    {name: '2', id: 2},
    {name: '3', id: 3},
    {name: '4', id: 4},
    {name: '5', id: 5},
    {name: '6', id: 6},
    {name: '7', id: 7},
    {name: '8', id: 8},
    {name: '9', id: 9},
    {name: '10', id: 10},
    {name: '11', id: 11},
    {name: '12', id: 12},
    {name: '14', id: 14},
    {name: '15', id: 15},
    {name: '16', id: 16},
    {name: '20', id: 20},
    {name: '24', id: 24},
    {name: '25', id: 25},
    {name: '30', id: 30},
    {name: '32', id: 32}
  ];

  $scope.interestIntervalOptions = [
    {name: '15', id: 15},
    {name: '20', id: 20},
    {name: '30', id: 30},
    {name: '60', id: 60},
    {name: '90', id: 90}
  ];

  $scope.interestCyclesAtEndOfGameOptions = [
    {name: '0', id: 0},
    {name: '1', id: 1},
    {name: '2', id: 2},
    {name: '3', id: 3},
    {name: '4', id: 4}
  ];

  $scope.debtInterestOptions = [
    {name: '0', id: 0},
    {name: '5', id: 5},
    {name: '10', id: 10},
    {name: '15', id: 15},
    {name: '20', id: 20}
  ];

  var map                              = null; // the google map handle
  var authToken                        = 'none';
  var mapCenter                        = new google.maps.LatLng(0, 0);
  var gameplayEditDateUpdatedCounter   = -1;
  $scope.joinUrl                       = gameUrl + '/anmelden/' + gameId;
  $scope.priceRangeLists               = [];
  $scope.sortableOptions               = [];
  /**
   * Init the sortable options
   */
  var initSortableOptions              = function () {

    $scope.sortableOptions[0] = {
      stop: function () {
        handleChangedPositionInPricelist($scope.priceRangeLists[0]);
      }
    };
    $scope.sortableOptions[1] = {
      stop: function () {
        handleChangedPositionInPricelist($scope.priceRangeLists[1]);
      }
    };
    $scope.sortableOptions[2] = {
      stop: function () {
        handleChangedPositionInPricelist($scope.priceRangeLists[2]);
      }
    };
    $scope.sortableOptions[3] = {
      stop: function () {
        handleChangedPositionInPricelist($scope.priceRangeLists[3]);
      }
    };
    $scope.sortableOptions[4] = {
      stop: function () {
        handleChangedPositionInPricelist($scope.priceRangeLists[4]);
      }
    };
    $scope.sortableOptions[5] = {
      stop: function () {
        handleChangedPositionInPricelist($scope.priceRangeLists[5]);
      }
    }

  };
  /**
   * Handles a changed position in a given list (ordering inside a price range). Saves the data immediately
   * @param priceList
   */
  var handleChangedPositionInPricelist = function (priceList) {
    var pu = [];

    for (var i = 0; i < priceList.length; i++) {
      priceList[i].property.setPositionInPriceRange(i);

      var p = priceList[i].property.getPricelistPositionSaveSet();
      if (p) {
        pu.push(p);
      }
    }

    console.log(pu);
    if (pu.length > 0) {
      $http.post('/gameplay/savePositionInPricelist/' + $scope.gameplay.internal.gameId, {
        authToken : authToken,
        properties: pu
      }).then(
        function (resp) {
          console.log('Game saved');
          $scope.statusText = resp.data.message;
          updateEditDate();
        },
        function (resp) {
          console.error('/gameplay/savePositionInPricelist/', resp);
          genericModals.showError('Fehler', 'Die Änderung konnte leider nicht gespeichert werden.', resp, function () {
          });
        }
      );
    }
  };

  /**
   * Sortable Options for class 0 list (cheapest)
   * @type {{stop: Function}}
   */
  $scope.sortableOptionsClass0 = {
    stop: function (e, ui) {
      handleChangedPositionInPricelist($scope.priceRangeLists.class0);
    }
  };
  /**
   * Sortable Options for class 1 list (cheap)
   * @type {{stop: Function}}
   */
  $scope.sortableOptionsClass1 = {
    stop: function (e, ui) {
      handleChangedPositionInPricelist($scope.priceRangeLists.class1);
    }
  };
  /**
   * Sortable Options for class 2 list (lower average)
   * @type {{stop: Function}}
   */
  $scope.sortableOptionsClass2 = {
    stop: function (e, ui) {
      handleChangedPositionInPricelist($scope.priceRangeLists.class2);
    }
  };
  /**
   * Sortable Options for class 3 list (higher average)
   * @type {{stop: Function}}
   */
  $scope.sortableOptionsClass3 = {
    stop: function (e, ui) {
      handleChangedPositionInPricelist($scope.priceRangeLists.class3);
    }
  };
  /**
   * Sortable Options for class 4 list (expensive)
   * @type {{stop: Function}}
   */
  $scope.sortableOptionsClass4 = {
    stop: function (e, ui) {
      handleChangedPositionInPricelist($scope.priceRangeLists.class4);
    }
  };
  /**
   * Sortable Options for class 5 list (most expensive)
   * @type {{stop: Function}}
   */
  $scope.sortableOptionsClass1 = {
    stop: function (e, ui) {
      handleChangedPositionInPricelist($scope.priceRangeLists.class5);
    }
  };


  /**
   * Sets the heigth of the map as large as possible. Workaround as I haven't found a fitting css rule!
   */
  var setMapHeight = function () {
    var dh          = $(window).height();
    var mc          = document.querySelector('#map_canvas');
    var h           = dh - 95;
    mc.style.height = h.toString() + 'px';
    google.maps.event.trigger(map, 'resize');

    var locList          = document.querySelector('#property-list');
    h                    = dh - 110 - $('#property-info').height() - $('#property-filter').height() - $('#property-list-header').height() - $('#ferropoly-navbar').height();
    locList.style.height = h.toString() + 'px';
  };
  /**
   * Setting current property, available from GUI
   * @param marker
   */
  $scope.setCurrentProperty = function (marker) {
    setCurrentProperty(marker);
    map.setCenter(marker.getPosition());
  };
  /**
   * Called when a marker is new set or a set marker is selected
   * @param marker
   */
  var setCurrentProperty = function (marker) {
    if (!marker) {
      return;
    }
    if ($scope.currentMarker && $scope.currentMarker.property) {
      $scope.currentMarker.property.setMarkerIcon(false);
    }
    marker.property.setMarkerIcon(true);
    $scope.currentMarker = marker;
    console.log(marker);
  };

  /**
   * Sets the visibility of the markers according to the propertyFilter
   */
  $scope.setVisibleMarkers = function () {
    console.log($scope.propertyFilter);
    $scope.displayedProperties = [];
    var mapToSet               = null;
    var filter                 = {priceRange: $scope.propertyFilter};

    for (var i = 0; i < $scope.markers.length; i++) {
      if ($scope.markers[i].property.fitsFilterCriteria(filter)) {
        mapToSet = map;
        $scope.displayedProperties.push($scope.markers[i].property);
      }
      else {
        mapToSet = null;
      }

      // This prevents flickering in the map
      if (mapToSet) {
        // Set map only if not already set
        if (!$scope.markers[i].map) {
          $scope.markers[i].setMap(mapToSet);
        }
      }
      else {
        // Remove map only if map is currently set
        if ($scope.markers[i].map) {
          $scope.markers[i].setMap(null);
        }
      }
    }
  };

  /**
   * Initializes all markers of the properties array
   * @param map  Google Map to use
   * @param properties Array with the properties
   */
  var initPropertyMarkers = function (map, properties) {
    var latSum = 0;
    var lngSum = 0;

    $scope.markers = [];

    for (var i = 0; i < properties.length; i++) {
      var newMarker = new google.maps.Marker({
        position : new google.maps.LatLng(properties[i].location.position.lat, properties[i].location.position.lng),
        map      : map,
        draggable: false
      });

      latSum += parseFloat(properties[i].location.position.lat);
      lngSum += parseFloat(properties[i].location.position.lng);

      newMarker.property = new Property(properties[i]);
      newMarker.property.attachToMarker(newMarker);
      newMarker.property.setMarkerIcon();

      $scope.markers.push(newMarker);

      // This is a special procedure allowing all markers to be unique (scope problem)!
      google.maps.event.addListener(newMarker, 'click', (function (newMarker) {
        return function () {
          setCurrentProperty(newMarker);
          // newMarker.setIcon('https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png');
          // document.getElementById('placeName').focus();
          $scope.$apply();
        }
      })(newMarker));
    }
    setCurrentProperty($scope.markers[0]);
    $scope.setVisibleMarkers();
    mapCenter = new google.maps.LatLng(latSum / i, lngSum / i)
  };

  /**
   * Save data
   * @param nextPanel
   */
  $scope.save = function (nextPanel) {
    // Convert times back to HH:MM (as defined by the schema), maintain compatibility
    var gpToSave                                              = _.cloneDeep($scope.gameplay);
    gpToSave.scheduling.gameStart                             = moment($scope.gameplay.scheduling.gameStart).format('HH:mm');
    gpToSave.scheduling.gameEnd                               = moment($scope.gameplay.scheduling.gameEnd).format('HH:mm');
    // Convert angular select values back
    gpToSave.gameParams.properties.numberOfPriceLevels        = $scope.numberOfPriceLevels;
    gpToSave.gameParams.properties.numberOfPropertiesPerGroup = $scope.numberOfPropertiesPerGroup;
    gpToSave.gameParams.interestInterval                      = $scope.interestInterval;
    gpToSave.gameParams.interestCyclesAtEndOfGame             = $scope.interestCyclesAtEndOfGame;
    gpToSave.gameParams.debtInterest                          = $scope.debtInterest;
    gpToSave.gameParams.rentFactors.noHouse                   = $scope.noHouse;
    gpToSave.gameParams.rentFactors.oneHouse                  = $scope.oneHouse;
    gpToSave.gameParams.rentFactors.twoHouses                 = $scope.twoHouses;
    gpToSave.gameParams.rentFactors.threeHouses               = $scope.threeHouses;
    gpToSave.gameParams.rentFactors.fourHouses                = $scope.fourHouses;
    gpToSave.gameParams.rentFactors.hotel                     = $scope.hotel;
    gpToSave.gameParams.housePrices                           = $scope.housePrices;
    gpToSave.joining.possibleUntil                            = $scope.joiningPossibleUntil;


    $http.post('/gameplay/save/' + $scope.gameplay.internal.gameId, {
      gameplay : gpToSave,
      authToken: authToken
    }).then(
      function () {
        console.log('Game saved');
        $scope.statusText = 'Spiel gespeichert';
        if (nextPanel) {
          $scope.panel = nextPanel;
          if (nextPanel === 'map') {
            $scope.showMapTab();
          }
        }
      },
      function (resp) {
        console.error('ERROR', resp);
        genericModals.showError('Fehler', 'Das Spiel konnte leider nicht gespeichert werden.', resp, function () {
          window.location.href = "/";
        });
        fa.exception('Can not save game: ' + resp.data.message);
      });

  };

  /**
   * Update the edit date of the gameplay when adding a property or changing the order in a price range. This is only
   * done from time to time
   */
  var updateEditDate = function () {
    gameplayEditDateUpdatedCounter++;
    if ((gameplayEditDateUpdatedCounter % 40) > 0) {
      return;
    }

    $http.post('/gameplay/dataChanged/' + $scope.gameplay.internal.gameId, {
      authToken: authToken
    }).then(
      function () {
        console.log('Game edit updated');
      },
      function (resp) {
        console.error('/gameplay/dataChanged/ failed', resp);
      });

  };
  /**
   * Show the map tab
   */
  $scope.showMapTab = function () {
    $scope.panel = 'map';

    // This delay is needed as otherwise google maps does not initialize using the complete screen
    $timeout(function () {
      setMapHeight();
      console.log(mapCenter);
      map.setCenter(mapCenter);
    }, 250);
  };
  /**
   * Lodash helps us to extract the properties of a given price range out of all in the map (already sorted)
   * @param range
   * @returns {*}
   */
  var extractPropertiesOfPriceRange = function (range) {
    return _.sortBy(_.filter($scope.markers, function (p) {
      return parseInt(p.property.data.pricelist.priceRange) === range
    }), function (n) {
      return parseInt(n.property.data.pricelist.positionInPriceRange)
    });
  };
  /**
   * Show the price list, create the list
   */
  $scope.showPriceList = function () {
    $scope.panel = 'pricelist';
    for (var i = 0; i < 6; i++) {
      $scope.priceRangeLists[i] = extractPropertiesOfPriceRange(i);
      // this will only trigger a save if something changed
      handleChangedPositionInPricelist($scope.priceRangeLists[i]);
    }
  };
  /**
   * When document loaded & ready
   */
  $(document).ready(function () {
    initializeMap();
    initSortableOptions();
    $http.get('/authtoken').then(
      function (resp) {
        authToken = resp.data.authToken;
        console.log('Auth ok');
        $http.get('/gameplay/load/' + gameId).then(
          function (resp) {
            var data = resp.data;
            console.log('gameplay loaded', data);
            if (data.gameplay.internal.finalized) {
              // finalized data, we can't edit
              genericModals.showError('Fehler', 'Das Spiel ist bereits finalisiert, Du solltest das nicht sehen!', resp, function () {
                window.location.href = "/";
              });
              return;
            }
            $scope.gameplay                      = data.gameplay;
            $scope.allProperties                 = data.properties;
            $scope.gameplayReadOnly.created      = moment($scope.gameplay.log.created).format("D.M.YY HH:mm");
            $scope.gameplayReadOnly.lastEdited   = moment($scope.gameplay.log.lastEdited).format("D.M.YY HH:mm");
            $scope.gameplayReadOnly.map          = $scope.gameplay.internal.map.toUpperCase();
            $scope.gameplayReadOnly.gameId       = $scope.gameplay.internal.gameId;
            $scope.gameplayReadOnly.gamedate     = moment($scope.gameplay.scheduling.gameDate).format("D.M.YY");
            // Conversion needed since using moment instead of DateJs
            $scope.gameplay.scheduling.gameStart = moment($scope.gameplay.scheduling.gameStart, 'H:mm').toDate();
            $scope.gameplay.scheduling.gameEnd   = moment($scope.gameplay.scheduling.gameEnd, 'H:mm').toDate();
            // Conversions needed as after an AngularJs upgrade the select labels didn't work as expected
            $scope.numberOfPriceLevels           = $scope.gameplay.gameParams.properties.numberOfPriceLevels;
            $scope.numberOfPropertiesPerGroup    = $scope.gameplay.gameParams.properties.numberOfPropertiesPerGroup;
            $scope.interestInterval              = $scope.gameplay.gameParams.interestInterval;
            $scope.interestCyclesAtEndOfGame     = $scope.gameplay.gameParams.interestCyclesAtEndOfGame;
            $scope.debtInterest                  = $scope.gameplay.gameParams.debtInterest;
            $scope.noHouse                       = $scope.gameplay.gameParams.rentFactors.noHouse;
            $scope.oneHouse                      = $scope.gameplay.gameParams.rentFactors.oneHouse;
            $scope.twoHouses                     = $scope.gameplay.gameParams.rentFactors.twoHouses;
            $scope.threeHouses                   = $scope.gameplay.gameParams.rentFactors.threeHouses;
            $scope.fourHouses                    = $scope.gameplay.gameParams.rentFactors.fourHouses;
            $scope.hotel                         = $scope.gameplay.gameParams.rentFactors.hotel;
            $scope.housePrices                   = $scope.gameplay.gameParams.housePrices;
            $scope.joiningPossibleUntil          = new Date($scope.gameplay.joining.possibleUntil);

            $scope.panel      = 'gameplay';
            $scope.statusText = 'Spiel geladen';
            console.log($scope.gameplay);

            initPropertyMarkers(map, $scope.allProperties);
          },
          function (resp) {
            console.error('/gameplay/load', resp);
            genericModals.showError('Fehler', 'Fehler beim Laden des Spiels', resp, function () {
              window.location.href = "/";
            });
          });

      },
      function (data, status) {
        console.log('authtoken failed', resp);
        genericModals.showError('Fehler', 'Bitte neu einloggen.', resp, function () {
          window.location.href = "/";
        });
      });

  });
  /**
   * Initialize the Google Map
   */
  var initializeMap = function () {

    map = new google.maps.Map(document.getElementById("map_canvas"), {
      center   : new google.maps.LatLng(47.29725, 8.867215),
      zoom     : 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $(window).resize(setMapHeight);
    setMapHeight();
  };

  /*
   Data of the current property changed
   */
  $scope.currentPropertyChanged = function () {
    if (!$scope.currentMarker || !$scope.currentMarker.property) {
      // This should not happen
      console.log('Can not save, no marker or property');
      return;
    }

    // Reset position in price range
    $scope.currentMarker.property.setPositionInPriceRange(-1);

    $http.post('/gameplay/saveProperty/' + $scope.gameplay.internal.gameId, {
      property : $scope.currentMarker.property.data,
      authToken: authToken
    }).then(
      function (resp) {
        console.log('Game saved');
        $scope.statusText = resp.data.message;
        $scope.setVisibleMarkers();
        updateEditDate();
      },
      function (resp) {
        console.error('/gameplay/saveProperty/ failed', resp);
        genericModals.showError('Fehler', 'Leider trat beim Speichern der Änderung ein Fehler auf.', resp, function () {
          window.location.href = "/";
        });
      });
  };

  /**
   * Gets the text for the current locations accessibility
   * @returns {string}
   */
  $scope.currentLocationAccessibility = function () {
    if (!$scope.currentMarker || !$scope.currentMarker.property) {
      // This should not happen
      return 'n/a';
    }
    return $scope.currentMarker.property.getAccessibilityText();
  };

  /**
   * Returns the game duration in minutes
   * @returns {number}
   */
  $scope.getGameDuration = function () {
    if ($scope.gameplay && $scope.gameplay.scheduling) {
      return moment($scope.gameplay.scheduling.gameEnd).diff(moment($scope.gameplay.scheduling.gameStart), 'minutes');
    }
    return 0;
  };

  /**
   * True when the duration of the game is valid
   * @returns {boolean}
   */
  $scope.gameDurationValid = function () {
    return ($scope.getGameDuration() >= 4);
  };

  /**
   * Property groups fit number of properties
   * @returns {boolean}
   */
  $scope.propertyGroupsValid = function () {
    if (!$scope.gameplay.gameParams) {
      return false;
    }
    return (($scope.getNumberOfProperties() % $scope.gameplay.gameParams.properties.numberOfPropertiesPerGroup) === 0);
  };

  /**
   * Returns the number of properties in the list
   * @returns {*}
   */
  $scope.getNumberOfProperties = function () {
    return (_.filter($scope.markers, function (p) {
      return parseInt(p.property.data.pricelist.priceRange) >= 0
    }).length);
  };
  /**
   * True, when the gameplay is valid
   * @returns {*|boolean}
   */
  $scope.gameplayValid = function () {
    return ($scope.gameDurationValid() && ($scope.getNumberOfProperties() > 19) && $scope.propertyGroupsValid())
  };


  /**
   * Finalize the pricelist
   */
  $scope.generatePricelist = function () {
    $http.post('/pricelist/create', {
      gameId   : $scope.gameplay.internal.gameId,
      authToken: authToken
    }).then(
      function (resp) {
        console.log('pricelist created');
        $scope.statusText = resp.data.message;
        self.location     = '/pricelist/view/' + resp.data.gameId;
        fa.event('Pricelist', 'created', $scope.gameplay.internal.gameId);
      },
      function (resp) {
        console.error('/pricelist/create failed', resp);
        genericModals.showError('Fehler', 'Die Preisliste konnte nicht erstellt werden.', resp, function () {
        });
        a.exception('Can not create pricelist: ' + resp.data.message);
      });
  };

}]);

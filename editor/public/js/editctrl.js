/**
 * Edit control
 * Created by kc on 05.02.15.
 */
'use strict';

/**********************************************************************************************************************/
var editControl = angular.module('editApp', ['ui.bootstrap', 'ui.sortable']);
editControl.controller('editCtrl', ['$scope', '$http', '$interval', '$timeout', function ($scope, $http, $interval, $timeout) {

  $scope.panel = 'init';
  $scope.errorMessage = '';
  $scope.gameplay = {};
  $scope.allProperties = [];
  $scope.markers = [];
  $scope.displayedProperties = [];
  $scope.gameplayReadOnly = {};
  $scope.statusText = '';
  $scope.currentMarker = undefined;
  $scope.propertyFilter = 'all';
  $scope.propertiesPredicate = 'data.location.name';
  $scope.reverse = false;


  var map = null; // the google map handle
  var authToken = 'none';
  var mapCenter = new google.maps.LatLng(0, 0);
  var gameplayEditDateUpdatedCounter = -1;

  $scope.priceRangeLists = [];
  $scope.sortableOptions = [];
  /**
   * Init the sortable options
   */
  var initSortableOptions = function () {

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
      $http.post('/edit/savePositionInPricelist', {
        gameId: $scope.gameplay.internal.gameId,
        authToken: authToken,
        properties: pu
      }).
        success(function (data) {
          if (data.success) {
            console.log('Game saved');
            $scope.statusText = data.message;
            updateEditDate();
          }
          else {
            console.log('Error');
            console.log(data);
            $scope.statusText = 'Fehler beim Speichern: ' + data.message;
          }
        }).
        error(function (data, status) {
          console.log('ERROR');
          console.log(data);
          console.log(status);
          $scope.statusText = 'Fehler beim Speichern: ' + data.message;
        });
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
    var dh = $(window).height();
    var mc = document.querySelector('#map_canvas');
    var h = dh - 95;
    mc.style.height = h.toString() + 'px';
    google.maps.event.trigger(map, 'resize');

    var locList = document.querySelector('#property-list');
    h = dh - 110 - $('#property-info').height() - $('#property-filter').height() - $('#property-list-header').height() - $('#ferropoly-navbar').height();
    locList.style.height = h.toString() + 'px';
  };
  /**
   * Setting current property, available from GUI
   * @param marker
   */
  $scope.setCurrentProperty = function (marker) {
    setCurrentProperty(marker);
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
  };

  /**
   * Sets the visibility of the markers according to the propertyFilter
   */
  $scope.setVisibleMarkers = function () {
    console.log($scope.propertyFilter);
    $scope.displayedProperties = [];
    var mapToSet = null;
    var filter = {priceRange: $scope.propertyFilter};

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
        position: new google.maps.LatLng(properties[i].location.position.lat, properties[i].location.position.lng),
        map: map,
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
    $http.post('/edit/save', {gameplay: $scope.gameplay, authToken: authToken}).
      success(function (data, status) {
        if (data.success) {
          console.log('Game saved');
          $scope.statusText = 'Spiel gespeichert';
          if (nextPanel) {
            $scope.panel = nextPanel;
          }
        }
        else {
          console.log('Error');
          console.log(data);
          $scope.errorMessage = 'Leider trat ein Fehler auf, Info:' + data.message;
          $scope.statusText = 'Fehler beim Speichern: ' + data.message;
        }
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
        $scope.errorMessage = 'Leider trat ein Fehler auf: Status:' + status + ', Info:' + data.message;
        $scope.statusText = 'Fehler beim Speichern: ' + data.message;
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

    $http.post('/edit/dataChanged', {gameId: $scope.gameplay.internal.gameId, authToken: authToken}).
      success(function (data, status) {
        if (data.success) {
          console.log('Game edit updated');
        }
        else {
          console.log('Error');
          console.log(data);
        }
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
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
    $http.get('/authtoken').
      success(function (data) {
        authToken = data.authToken;
        console.log('Auth ok');
        $http.get('/edit/load-game?gameId=' + gameId).
          success(function (data) {
            console.log(data);
            if (!data.success) {
              $scope.panel = 'error';
              $scope.errorMessage = 'Der Server liefert folgende Antwort: ' + data.message;
              return;
            }
            $scope.gameplay = data.gameplay;
            $scope.allProperties = data.properties;
            $scope.gameplayReadOnly.created = new Date($scope.gameplay.log.created).toString("d.M.yy HH:mm");
            $scope.gameplayReadOnly.lastEdited = new Date($scope.gameplay.log.lastEdited).toString("d.M.yy HH:mm");
            $scope.gameplayReadOnly.map = $scope.gameplay.internal.map.toUpperCase();
            $scope.gameplayReadOnly.gameId = $scope.gameplay.internal.gameId;
            $scope.gameplayReadOnly.gamedate = new Date($scope.gameplay.scheduling.gameStart).toString("d.M.yy");
            $scope.panel = 'gameplay';
            $scope.statusText = 'Spiel geladen';

            initPropertyMarkers(map, $scope.allProperties);
          }).
          error(function (data, status) {
            console.log('load-game-error');
            console.log(data);
            console.log(status);
            $scope.panel = 'error';
            $scope.errorMessage = 'Ladefehler, das Spiel kann nicht bearbeitet werden. Status: ' + status;
          });

      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.panel = 'error';
        $scope.errorMessage = 'Authentisierungsfehler, das Spiel kann nicht bearbeitet werden. Status: ' + status;
      });

  });
  /**
   * Initialize the Google Map
   */
  var initializeMap = function () {

    map = new google.maps.Map(document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(47.29725, 8.867215),
      zoom: 10,
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

    $http.post('/edit/saveProperty', {property: $scope.currentMarker.property.data, authToken: authToken}).
      success(function (data, status) {
        if (data.success) {
          console.log('Game saved');
          $scope.statusText = data.message;
          $scope.setVisibleMarkers();
          updateEditDate();
        }
        else {
          console.log('Error');
          console.log(data);
          $scope.errorMessage = 'Leider trat ein Fehler auf, Info:' + data.message;
          $scope.statusText = 'Fehler beim Speichern: ' + data.message;
        }
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
        $scope.errorMessage = 'Leider trat ein Fehler auf: Status:' + status + ', Info:' + data.message;
        $scope.statusText = 'Fehler beim Speichern: ' + data.message;
      });
  };

  /**
   * Finalize the pricelist
   */
  $scope.finalizePricelist = function() {
    $http.post('/pricelist/create', {gameId: $scope.gameplay.internal.gameId, authToken: authToken}).
      success(function (data, status) {
        if (data.success) {
          console.log('pricelist created');
          $scope.statusText = data.message;
          self.location = '/pricelist?gameId=' + data.gameId;
        }
        else {
          console.log('Error');
          console.log(data);
        }
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
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
      var start = Date.parse($scope.gameplay.scheduling.gameStart).getTime();
      var end = Date.parse($scope.gameplay.scheduling.gameEnd).getTime();
      return ((end - start) / 60 / 1000);
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
  $scope.propertyGroupsValid = function() {
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


}]);

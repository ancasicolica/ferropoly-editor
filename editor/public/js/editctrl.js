/**
 * Edit control
 * Created by kc on 05.02.15.
 */
'use strict';

/**********************************************************************************************************************/
var editControl = angular.module('editApp', ['ui.bootstrap']);
editControl.controller('editCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.panel = 'init';
  $scope.errorMessage = '';
  $scope.gameplay = {};
  $scope.properties = [];
  $scope.gameplayReadOnly = {};
  $scope.statusText = '';
  $scope.currentMarker = undefined;

  var map = null; // the google map handle
  var authToken = 'none';
  var mapCenter = new google.maps.LatLng(0,0);
  /**
   * Sets the heigth of the map as large as possible. Workaround as I haven't found a fitting css rule!
   */
  var setMapHeight = function () {
    var dh = $(window).height();
    var mc = document.querySelector('#map_canvas');
    var h = dh - 95;
    mc.style.height = h.toString() + 'px';
    google.maps.event.trigger(map,'resize');
    /*
     var locList = document.querySelector('#location-list');
     h = dh - 45 - $('#location-editor').height() - $('#location-list-title').height() - $('#tablist').height();
     locList.style.height = h.toString() + 'px';*/
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

  var initPropertyMarkers = function(map, properties) {
    var latSum = 0;
    var lngSum = 0;

    for (var i = 0; i < properties.length; i++) {
      var newMarker = new google.maps.Marker({
        position:new google.maps.LatLng(properties[i].location.position.lat, properties[i].location.position.lng) ,
        map: map,
        draggable: false
      });

      latSum += parseFloat(properties[i].location.position.lat);
      lngSum += parseFloat(properties[i].location.position.lng);

      newMarker.property = new Property(properties[i]);
      newMarker.property.attachToMarker(newMarker);
      newMarker.property.setMarkerIcon();

      // This is a special procedure allowing all markers to be unique (scope issue)!
      google.maps.event.addListener(newMarker, 'click', (function (newMarker) {
        return function () {
          setCurrentProperty(newMarker);
          // newMarker.setIcon('https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png');
         // document.getElementById('placeName').focus();
          $scope.$apply();
        }
      })(newMarker));
    }

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

  $scope.showMapTab = function() {
    $scope.panel='map';
    setMapHeight();
    console.log(mapCenter);
    map.setCenter(mapCenter);

  };
  /**
   * When document loaded & ready
   */
  $(document).ready(function () {
    initializeMap();
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
            $scope.properties = data.properties;
            $scope.gameplayReadOnly.created = new Date($scope.gameplay.log.created).toString("d.M.yy HH:mm");
            $scope.gameplayReadOnly.lastEdited = new Date($scope.gameplay.log.lastEdited).toString("d.M.yy HH:mm");
            $scope.gameplayReadOnly.map = $scope.gameplay.internal.map.toUpperCase();
            $scope.gameplayReadOnly.gameId = $scope.gameplay.internal.gameId;
            $scope.gameplayReadOnly.gamedate = new Date($scope.gameplay.scheduling.gameStart).toString("d.M.yy");
            $scope.panel = 'gameplay';
            $scope.statusText = 'Spiel geladen';

            initPropertyMarkers(map, $scope.properties);
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


}]);

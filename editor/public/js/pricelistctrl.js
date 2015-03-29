/**
 * Priceslist controller
 * Created by kc on 21.03.15.
 */
'use strict';

var pricelistControl = angular.module('pricelistApp', ['ui.bootstrap', 'ui.sortable']);
pricelistControl.controller('pricelistCtrl', ['$scope', '$http', '$interval', '$timeout', function ($scope, $http, $interval, $timeout) {

  $scope.test = gameId;
  $scope.data = undefined;

  $scope.panel = 'list';
  var authToken = 'none';
  $scope.setPanel = function (panel) {
    $scope.panel = panel;
  };

  $scope.finalizeIt = function () {

    $http.post('/gameplay/finalize', {gameId: $scope.data.gameplay.internal.gameId, authToken: authToken}).
      success(function (data) {
        if (data.success) {
          console.log('Gameplay finalized');
          $scope.statusText = data.message;
          $scope.data.gameplay.internal.finalized = true;
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
  };

  /**
   * After loading the document, we load the gameplay and pricelist
   */
  $(document).ready(function () {
    $http.get('/pricelist/get?gameId=' + gameId).
      success(function (data) {
        console.log(data);
        if (!data.success) {
          $scope.panel = 'error';
          $scope.errorMessage = 'Der Server liefert folgende Antwort: ' + data.message;
          return;
        }
        $scope.data = data;

        $http.get('/authtoken').
          success(function (data) {
            authToken = data.authToken;
            console.log('Auth ok');
          }).
          error(function (data, status) {
            console.log('error:');
            console.log(data);
            console.log(status);
            $scope.errorMessage = 'Authentisierungsfehler, das Spiel kann nicht bearbeitet werden. Status: ' + status;
          });

      }).
      error(function (data, status) {
        console.log('load-game-error');
        console.log(data);
        console.log(status);
        $scope.panel = 'error';
        $scope.errorMessage = 'Ladefehler, das Spiel kann nicht angesehen werden. Status: ' + status;
      });
  });


}]);

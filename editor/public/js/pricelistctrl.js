/**
 * Priceslist controller
 * Created by kc on 21.03.15.
 */
'use strict';

var pricelistControl = angular.module('pricelistApp', ['ui.bootstrap', 'ui.sortable']);
pricelistControl.controller('pricelistCtrl', ['$scope', '$http', '$interval', '$timeout', function ($scope, $http, $interval, $timeout) {

  $scope.test = gameId;
  $scope.data = undefined;


  /**
   * After loading the document, we load the gameplay and pricelist
   */
  $( document ).ready(function() {
    $http.get('/pricelist/get?gameId=' + gameId).
      success(function (data) {
        console.log(data);
        if (!data.success) {
          $scope.panel = 'error';
          $scope.errorMessage = 'Der Server liefert folgende Antwort: ' + data.message;
          return;
        }
        $scope.data = data;
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

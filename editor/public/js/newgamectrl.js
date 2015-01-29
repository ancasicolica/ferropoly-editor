/**
 *
 * Created by kc on 29.01.15.
 */
'use strict';
var newGameControl = angular.module('newgameApp', ['ui.bootstrap']);

/**
 * This is the control for the sign-up process for ferropoly
 */
newGameControl.controller('newgameCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.map = 'zvv';
  $scope.gamename = 'Ferropoly Spiel';
  var authToken = 'none';

  $(document).ready(function () {
    $http.get('/authtoken').
      success(function(data, status, headers, config) {
        authToken = data.authToken;
        console.log('authtoken:' + authToken);
      }).
      error(function(data, status, headers, config) {
        console.log('error:');
        console.log(data);
        console.log(status);
      });
  });

  $scope.validateAndSave = function () {
    $http.post('/newgame', {gamename: $scope.gamename, map: $scope.map, authToken: authToken}).
      success(function(data, status, headers, config) {
        console.log('OK');
        console.log(data);
        console.log(status);
      }).
      error(function(data, status, headers, config) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
      });
  }
}]);

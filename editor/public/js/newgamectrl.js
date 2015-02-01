/**
 * New Gameplay form for Ferropoly
 *
 * Created by kc on 29.01.15.
 */
'use strict';
var newGameControl = angular.module('newgameApp', ['ui.bootstrap']);
newGameControl.controller('newgameCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.map = 'zvv';
  $scope.gamename = 'Ferropoly Spiel';
  $scope.errorMessage = '';
  var authToken = 'none';

  $(document).ready(function () {
    $http.get('/authtoken').
      success(function (data) {
        authToken = data.authToken;
        console.log('Auth ok');
      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.errorMessage = 'Authentisierungsfehler, das Spiel kann nicht erstellt werden. Status: ' + status;
      });
  });

  $scope.validateAndSave = function () {
    $http.post('/newgame', {gamename: $scope.gamename, map: $scope.map, authToken: authToken}).
      success(function (data, status) {
        console.log('Game saved');
        self.location = '/edit?id=' + data.gameplay;
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
        $scope.errorMessage = 'Leider trat ein Fehler auf: ' + data.message;
      });
  }
}]);

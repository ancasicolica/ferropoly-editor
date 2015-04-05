/**
 * New Gameplay form for Ferropoly
 *
 * Created by kc on 29.01.15.
 */
'use strict';
var newGameControl = angular.module('newgameApp', ['ui.bootstrap', 'pickadate']).config(function (pickadateI18nProvider) {
  pickadateI18nProvider.translations = {
    prev: '<i class="icon-chevron-left"></i> früher',
    next: 'später <i class="icon-chevron-right"></i>'
  }
});

newGameControl.controller('newgameCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.map = 'zvv';
  $scope.gamename = 'Ferropoly Spiel';
  $scope.errorMessage = '';
  $scope.gamedate = new Date().add(1).day().toString('yyyy-MM-dd');
  $scope.dateError = undefined;
  $scope.minDate = Date.today().toString('yyyy-MM-dd');

  var authToken = 'none';

  /**
   * When document ready, get the auth token
   */
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

  /**
   * Validate the date of the new game, must be in the future
   */
  $scope.validateDate = function () {
    if (new Date($scope.gamedate) < new Date()) {
      $scope.dateError = 'Das Datum muss in der Zukunft liegen.';
    }
    else {
      $scope.dateError = undefined;
    }
  };

  /**
   * Save game
   */
  $scope.validateAndSave = function () {
    $http.post('/gameplay/createnew', {
      gamename: $scope.gamename,
      map: $scope.map,
      gamedate: $scope.gamedate,
      authToken: authToken
    }).
      success(function (data, status) {
        if (data.success) {
          console.log('Game saved');
          self.location = '/edit?gameId=' + data.gameId;
        }
        else {
          console.log('Error');
          console.log(data);
          $scope.errorMessage = 'Leider trat ein Fehler auf, Info:' + data.message;
        }
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
        $scope.errorMessage = 'Leider trat ein Fehler auf: Status:' + status + ', Info:' + data.message;
      });
  }
}]);

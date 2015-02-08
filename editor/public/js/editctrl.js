/**
 * Edit control
 * Created by kc on 05.02.15.
 */
'use strict';
var editControl = angular.module('editApp', ['ui.bootstrap']);
editControl.controller('editCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.panel = 'init';
  $scope.errorMessage = '';
  $scope.gameplay = {};
  $scope.gameplayReadOnly = {};
  $scope.statusText = '';

  var authToken = 'none';


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

  $(document).ready(function () {
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
            $scope.gameplayReadOnly.created = new Date($scope.gameplay.log.created).toString("d.M.yy HH:mm");
            $scope.gameplayReadOnly.lastEdited = new Date($scope.gameplay.log.lastEdited).toString("d.M.yy HH:mm");
            $scope.gameplayReadOnly.map = $scope.gameplay.internal.map.toUpperCase();
            $scope.gameplayReadOnly.gameId = $scope.gameplay.internal.gameId;
            $scope.gameplayReadOnly.gamedate = new Date($scope.gameplay.scheduling.gameStart).toString("d.M.yy");
            $scope.panel = 'gameplay';
            $scope.statusText = 'Spiel geladen';
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
}]);

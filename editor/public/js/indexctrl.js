/**
 *
 * Created by kc on 01.02.15.
 */
'use strict';

var indexControl = angular.module('indexApp', ['ui.bootstrap']);
indexControl.controller('indexCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.gameplays = [];
  var authToken;
  $scope.gameplayToDelete;

  /**
   * Get the auttoken (async!)
   */
  var getAuthToken = function () {
    $http.get('/authtoken').
      success(function (data) {
        authToken = data.authToken;
        console.log('Auth ok');
      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.panel = 'error';
        $scope.errorMessage = 'Authentisierungsfehler. Status: ' + status;
      });
  };

  // When document ready, load gameplays
  $(document).ready(function () {
    $http.get('/gameplay/mygames').
      success(function (data) {
        if (data.success) {
          $scope.gameplays = data.gameplays;
        }
        else {
          $scope.gameplays = [];
        }
        console.log(data);
        console.log('Gameplays loaded, nb:' + $scope.gameplays.length);

        $scope.gameplays.forEach(function (gp) {
          var d = new Date(gp.log.lastEdited);
          console.log(d);
          console.log(gp.log.lastEdited);
        });
        getAuthToken();
      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.gameplays = [];
      });
  });
  /**
   * Prepares a gameplay for deletion
   * @param obj
   */
  $scope.prepareToDelete = function (obj) {
    $scope.gameplayToDelete = obj.gameplay;
  };

  /**
   * Returns true if we are not allowed delete the gameplay. This is  the case if the game date is today
   * @param gameplay
   */
  $scope.notAllowedToDeleteGameplay = function (gameplay) {
    console.log(gameplay);
    return ((gameplay.internal.finalized && moment(gameplay.scheduling.gameDate).startOf('day').isSame(moment().startOf('day'))) ||
    gameplay.internal.gameId === 'play-a-demo-game');
  };

  /**
   * Delete a gameplay permanently
   * @param obj "this" object
   */
  $scope.deleteGameplay = function () {
    if (!$scope.gameplayToDelete) {
      console.log('no gameplay to delete');
      return;
    }

    $http.post('/gameplay/delete', {gameId: $scope.gameplayToDelete.internal.gameId, authToken: authToken}).
      success(function (data) {
        if (data.success) {
          console.log('gameplay deleted');
          console.log(data);
          // Remove from UI
          _.remove($scope.gameplays, function (gp) {
            return (gp.internal.gameId === $scope.gameplayToDelete.internal.gameId);
          });
          $scope.statusText = 'Spiel gelöscht: ' + $scope.gameplayToDelete.gamename;
          fa.event('Gameplay', 'deleted', $scope.gameplayToDelete.internal.gameId);
          $scope.gameplayToDelete = null;
        }
        else {
          console.log('Error');
          console.log(data);
          $scope.statusText = 'Spiel konnte nicht gelöscht werden: ' + $scope.gameplayToDelete.gamename;
          fa.exception('Can not delete gameplay:' + data.message);
          $scope.gameplayToDelete = null;
        }
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
        $scope.statusText = 'Spiel konnte nicht gelöscht werden: ' + $scope.gameplayToDelete.gamename;
        fa.exception('Can not delete gameplay:' + data.message);
        $scope.gameplayToDelete = null;
      });
  }

}]);

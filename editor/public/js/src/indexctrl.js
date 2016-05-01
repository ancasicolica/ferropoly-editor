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

  // Be kind and say hello
  if (moment().hour() < 4) {
    $scope.intro = 'Hallo';
  } else if (moment().hour() < 10) {
    $scope.intro = 'Guten Morgen';
  } else if (moment().hour() < 17) {
    $scope.intro = 'Hallo';
  } else {
    $scope.intro = 'Guten Abend';
  }

  /**
   * Get the auttoken (async!)
   */
  var getAuthToken = function () {
    $http.get('/authtoken').success(function (data) {
      authToken = data.authToken;
      console.log('Auth ok');
    }).error(function (data, status) {
      console.log('error:');
      console.log(data);
      console.log(status);
      $scope.panel        = 'error';
      $scope.errorMessage = 'Authentisierungsfehler. Status: ' + status;
    });
  };

  // Accept AGB
  $scope.acceptAgb = function () {
    $http({method: 'POST', url: '/agb/accept'}).then(
      function () {
        $scope.agb.accepted = true;
      },
      function (resp) {
        console.error(resp);
      }
    );
  };
  // Decline AGB
  $scope.declineAgb = function () {
    $http({method: 'POST', url: '/logout'}).then(
      function () {
        console.log('logged out');
        window.location.replace("/");
      },
      function (resp) {
        console.error(resp);
      }
    );
  };
  // When document ready, load gameplays and AGB info
  $(document).ready(function () {
    var index = moment().hours() % 6;
    $('#info-header').css('background-image', 'url("/images/ferropoly_header_0' + index + '.jpg")');

    $http({method: 'GET', url: '/agb'}).then(
      function (resp) {
        console.log(resp);
        $scope.agb = resp.data.info;
        if ($scope.agb.actionRequired) {
          $('#agb-trigger').click();
        }
      },
      function (resp) {
        console.error(resp);
      }
    );

    $http({method: 'GET', url: '/gameplay/mygames'}).then(
      function (resp) {
        console.log(resp);
        if (resp.data.success) {
          $scope.gameplays = resp.data.gameplays;
        }
        else {
          $scope.gameplays = [];
        }
        console.log('Gameplays loaded, nb:' + $scope.gameplays.length);

        $scope.gameplays.forEach(function (gp) {
          var d = new Date(gp.log.lastEdited);
          console.log(d);
          console.log(gp.log.lastEdited);
        });
        getAuthToken();
      },
      function (resp) {
        console.error(resp);
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
   * Returns true if we are not allowed delete the gameplay. This is  the case if the game date is today OR the logged
   * in user is not the owner of the gameplay
   * @param gameplay
   */
  $scope.notAllowedToDeleteGameplay = function (gameplay) {
    return ((gameplay.internal.finalized && moment(gameplay.scheduling.gameDate).startOf('day').isSame(moment().startOf('day'))) ||
    gameplay.internal.gameId === 'play-a-demo-game' || !gameplay.isOwner);
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

    $http.post('/gameplay/delete', {
      gameId   : $scope.gameplayToDelete.internal.gameId,
      authToken: authToken
    }).success(function (data) {
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
    }).error(function (data, status) {
      console.log('ERROR');
      console.log(data);
      console.log(status);
      $scope.statusText = 'Spiel konnte nicht gelöscht werden: ' + $scope.gameplayToDelete.gamename;
      fa.exception('Can not delete gameplay:' + data.message);
      $scope.gameplayToDelete = null;
    });
  }

}]);

/**
 * Player controller
 * Created by kc on 24.03.15.
 */
'use strict';

// Prerequisites: calculate the start of the game with an offset of 10 minutes
var gameStart   = moment(gameplay.scheduling.gameDate);
var startHour   = parseInt(gameplay.scheduling.gameStart.split(':')[0]);
var startMinute = parseInt(gameplay.scheduling.gameStart.split(':')[1]);
gameStart.set({'hour': startHour, 'minute': startMinute});
console.log('Game starts: ', gameStart.toDate());


// The angular app for this view
angular.module('playerApp', []).controller('playerCtrl', ['$scope', '$http', function ($scope, $http) {
  var authToken = '';

  $scope.teams              = [];
  $scope.currentTeam        = undefined;
  $scope.currentDataChanged = false;
  $scope.maxGroupNb         = 20; // That's checked on server side too, don't try to fake it :-)
  $scope.gameplay           = gameplay;
  /**
   * Sort the teams
   */
  $scope.sortTeams = function () {
    $scope.teams = _.sortBy($scope.teams, function (t) {
      if (!t.data.name) {
        return '';
      }
      return t.data.name.toUpperCase();
    });
  };

  /**
   * Returns true when this is a demo game (no worries, the server handles this too, it's just for the UI here)
   * @returns {boolean}
   */
  $scope.isDemoGame = function () {
    return gameId === 'play-a-demo-game';
  };

  /**
   * Disabling the button when deleting is not allowed
   */
  $scope.isDeleteAllowed = function () {
    if (!gameplay.scheduling.gameStartTs) {
      // GPs not finalized are ok
      return true;
    }
    return moment().isBefore(gameplay.scheduling.gameStartTs);
  };

  $scope.isAddingNewTeamsAllowed = function () {
    return (moment().isBefore(gameplay.scheduling.gameDate) && ($scope.teams.length < $scope.maxGroupNb) && !$scope.isDemoGame());
  };

  /**
   * Set the current team
   * @param team
   */
  $scope.setCurrentTeam = function (team) {
    if ($scope.currentTeam && !$scope.playerForm.$valid) {
      console.log('invalid data, can not change the team');
      $scope.statusText = 'Daten unvollständig';
      return;
    }

    if ($scope.currentDataChanged) {
      $scope.saveTeam(function (err) {
        if (err) {
          console.error(err);
          genericModals.showError('Fehler', 'Das Team konnte nicht gespeichert werden.', {data: err}, function () {
            window.location.href = "/";
          });
        }
        $scope.currentTeam        = team;
        $scope.currentDataChanged = false;
      })
    }
    else {
      $scope.currentTeam        = team;
      $scope.currentDataChanged = false;
    }
    _.delay($scope.validateForm, 500);
  };

  function createNewTeam(callback) {
    $http.post('/player/create', {gameId: gameId, authToken: authToken}).then(
      function (resp) {
        console.log('team created', resp.data);
        $scope.statusText = 'Neues Team angelegt';
        fa.event('Teams', 'new', {gameId: gameId});
        $scope.teams.push(resp.data.team);
        $scope.sortTeams();
        $scope.currentTeam = resp.data.team;
        _.delay($scope.validateForm, 500);
        if (callback) {
          return callback(null);
        }
      },
      function (resp) {
        console.error('/player/create failed', resp)
        $scope.statusText = 'Fehler beim anlegen';
        if (callback) {
          return callback(new Error(resp.data.message));
        }
        genericModals.showError('Fehler', 'Das Team konnte nicht angelegt werden.', resp, function () {
          window.location.href = "/";
        });
      }
    );
  }

  /**
   * Create a team
   */
  $scope.newTeam = function () {
    if ($scope.currentTeam && !$scope.playerForm.$valid) {
      console.log('invalid data, can not add a team');
      $scope.statusText = 'Zuerst aktuelles Team fertig bearbeiten';
    }
    else if ($scope.currentTeam) {
      $scope.saveTeam(function (err) {
        if (err) {
          $scope.statusText = 'Fehler beim Speichern: ' + err.message;
          return;
        }
        createNewTeam();
      });
    }
    else {
      createNewTeam();
    }
  };

  /**
   * Save team
   * @param callback
   */
  $scope.saveTeam = function (callback) {
    if (!callback) {
      callback = function (err) {
        console.log(err)
      };
    }
    $http.post('/player/store', {team: $scope.currentTeam, authToken: authToken}).then(
      function (resp) {
        var data = resp.data;
        console.log('team updated', data.team);
        $scope.statusText  = $scope.currentTeam.data.name + ' gespeichert';
        $scope.currentTeam = data.team;
        // replace also in list
        var t              = _.find($scope.teams, {'uuid': data.team.uuid});
        if (t) {
          _.remove($scope.teams, {'uuid': data.team.uuid});
          $scope.teams.push(data.team);
        }
        else {
          console.warn('Was not able to update the team');
        }
        $scope.sortTeams();
        fa.event('Teams', 'new', {name: $scope.currentTeam.data.name, gameId: gameId});
        return callback(null);

      },
      function (resp) {
        console.error('/player/store failed', resp)
        $scope.statusText = 'Fehler beim speichern';
        return callback(new Error(data.message));
      });
  };

  /**
   * Confirm a team with online registratio
   */
  $scope.confirmTeam = function (team) {
    team.confirmationActive = true;
    $http({
      method: 'POST',
      url   : '/player/confirm',
      data  : {authToken: authToken, gameId: team.gameId, teamId: team.uuid}
    }).then(
      function (resp) {
        // Success
        team.data.confirmed = true;
      },
      function (resp) {
        // Error
        team.confirmationActive = false;
        console.error(resp);
      }
    )
  };
  /**
   * Delete a team
   */
  $scope.deleteTeam = function () {
    if (!$scope.isDeleteAllowed()) {
      console.warn('Game is running, do not delete a team!');
      return;
    }
    var i = $scope.teams.indexOf($scope.currentTeam);
    $http.delete('/player/' + gameId + '/' + $scope.currentTeam.uuid, {
      authToken: authToken
    }).then(
      function () {
        console.log('team deleted');

        if (i > -1) {
          $scope.teams.splice(i, 1);
        }
        $scope.sortTeams();
        $scope.currentTeam = undefined;
        if ($scope.teams.length > 0) {
          $scope.setCurrentTeam($scope.teams[0]);
        }
      },
      function (resp) {
        console.error('/player/delete failed', resp)
        genericModals.showError('Fehler', 'Das Team konnte nicht gelöscht werden.', resp, function () {
          window.location.href = "/";
        });
      });
  };

  /**
   * Validates the form
   */
  $scope.validateForm = function () {
    if ($scope.playerForm.contactName.$valid) {
      $('#contactName').addClass('valid-data').removeClass('invalid-data');
    }
    else {
      $('#contactName').addClass('invalid-data').removeClass('valid-data');
    }
    if ($scope.playerForm.name.$valid) {
      $('#name').addClass('valid-data').removeClass('invalid-data');
    }
    else {
      $('#name').addClass('invalid-data').removeClass('valid-data');
    }
    if ($scope.playerForm.email.$valid) {
      $('#email').addClass('valid-data').removeClass('invalid-data');
    }
    else {
      $('#email').addClass('invalid-data').removeClass('valid-data');
    }
  };

  /**
   * Load teams when document ready
   */
  $(document).ready(function () {
    $http.get('/authtoken').then(
      function (resp) {
        authToken = resp.data.authToken;
        console.log('Auth ok');
        $http.get('/player/get/' + gameId).then(
          function (resp) {
            console.log('player/get', resp.data);
            $scope.teams = resp.data.teams;
            $scope.sortTeams();
            if ($scope.teams.length > 0) {
              $scope.setCurrentTeam($scope.teams[0]);
            }
            else {
              $scope.currentTeam = undefined;
            }
            console.log('Teams geladen', $scope.teams);
            $scope.statusText = 'Daten geladen';
          },
          function (resp) {
            $scope.statusText = 'Fehler beim Laden der Teams';
            console.error('/player/get failed', resp);
          });
      },
      function (resp) {
        console.error('/player/get failed', resp);
        $scope.statusText = 'Authentisierungsfehler';
      });
  });
}]);

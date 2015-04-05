/**
 * Player controller
 * Created by kc on 24.03.15.
 */
'use strict';


/**
 * Generate a UUID
 * @returns {string} UUID
 */
var generateUUID = function () {
  var d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
};

angular.module('playerApp', []).controller('playerCtrl', ['$scope', '$http', function ($scope, $http) {
  var authToken = '';

  $scope.teams = [];
  $scope.currentTeam = undefined;
  $scope.currentDataChanged = false;
  $scope.maxGroupNb = 20; // I know it's at the wrong place, but if you abuse it, I'll kick you out of the game ;-)
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
      $scope.saveTeam(function(err) {
        if (err) {
          console.error(err);
        }
        $scope.currentTeam = team;
        $scope.currentDataChanged = false;
      })
    }
    else {
      $scope.currentTeam = team;
      $scope.currentDataChanged = false;
    }
    _.delay($scope.validateForm, 500);
  };

  /**
   * Create a team
   */
  $scope.newTeam = function () {
    if ($scope.currentTeam && !$scope.playerForm.$valid) {
      console.log('invalid data, can not add a team');
      $scope.statusText = 'Zuerst aktuelles Team fertig bearbeiten';
      return;
    }

    var newGroup = {data: {name: 'Neue Gruppe' + $scope.teams.length}, gameId: gameId, uuid: generateUUID()};
    $scope.teams.push(newGroup);
    $scope.sortTeams();
    $scope.currentTeam = newGroup;
    _.delay($scope.validateForm, 500);
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
    $http.post('/player/store', {team: $scope.currentTeam, authToken: authToken}).
      success(function (data, status) {
        if (data.success) {
          console.log('team updated');
          $scope.statusText = $scope.currentTeam.data.name + ' gespeichert';
          return callback(null);
        }
        else {
          console.log('Error');
          console.log(data);
          $scope.statusText = 'Fehler beim speichern';
          return callback(new Error(data.message));
        }
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
        $scope.statusText = 'Fehler beim speichern';
        return callback(new Error(data.message));
      });
  };

  /**
   * Delete a team
   */
  $scope.deleteTeam = function () {
    var i = $scope.teams.indexOf($scope.currentTeam);
    $http.post('/player/delete', {teamId: $scope.currentTeam.uuid, authToken: authToken}).
      success(function (data, status) {
        if (data.success) {
          console.log('team deleted');
        }
        else {
          console.log('error while deleting: ' + data);
        }
          if (i > -1) {
            $scope.teams.splice(i, 1);
          }
          $scope.sortTeams();
          $scope.currentTeam = undefined;
          if ($scope.teams.length > 0) {
            $scope.setCurrentTeam($scope.teams[0]);
          }
      }).
      error(function (data, status) {
        console.log('ERROR');
        console.log(data);
        console.log(status);
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
    $http.get('/authtoken').
      success(function (data) {
        authToken = data.authToken;
        console.log('Auth ok');
        $http.get('/player/get?gameId=' + gameId).
          success(function (data) {
            console.log(data);
            $scope.teams = data.teams;
            $scope.sortTeams();
            if ($scope.teams.length > 0) {
              $scope.setCurrentTeam($scope.teams[0]);
            }
            else {
              $scope.currentTeam = undefined;
            }
            $scope.statusText = 'Daten geladen';
          }).
          error(function (data, status) {
            $scope.statusText = 'Fehler beim Laden der Teams';
            console.log('load-game-error');
            console.log(data);
            console.log(status);
          });
      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.statusText = 'Authentisierungsfehler';
      });
  });
}]);
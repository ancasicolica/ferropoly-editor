/**
 * Angular Controller for the administrator view
 *
 * Created by kc on 15.10.15.
 */
'use strict';

angular.module('adminsApp', []).controller('adminsCtrl', ['$scope', '$http', function ($scope, $http) {
  var authToken = '';

  $scope.adminInfo = adminInfo; // contains info about the users already available
  $scope.logins    = gameplay.admins.logins;
  $scope.saved     = false;
  $scope.saveError = '';
  $scope.changed   = false;

  /**
   * Checks if a user is existing (known) by the ferropoly
   * @param index
   */
  $scope.isExistingUser = function (index) {
    if (_.isString($scope.logins[index]) && $scope.logins[index].length === 0) {
      return 'empty';
    }
    return _.isObject($scope.adminInfo[$scope.logins[index]]);
  };

  /**
   * Checks if there is a user without a login
   */
  $scope.hasUserWithoutLogin = function () {
    if ($scope.changed) {
      return false;
    }

    for (var i = 0; i < 3; i++) {
      if (!$scope.isExistingUser(i)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Checks if all users (if there are any) have a login
   */
  $scope.allDefinedUsersHaveLogin = function () {
    if (!$scope.changed) {
      return false;
    }

    var retVal = false;
    for (var i = 0; i < 3; i++) {
      switch ($scope.isExistingUser(i)) {
        case true:
          retVal = true;
          break;

        case false:
          return false;

        case 'empty':
          break;
      }
    }
    return retVal;
  };

  /**
   * Saves all admins
   */
  $scope.save = function () {
    $http.post('/admins/save', {
      gameId   : gameplay.gameId,
      logins   : $scope.logins,
      authToken: authToken
    }).then(
      function (resp) {
        console.log('admins updated');
        // Google Analytics
        fa.event('Admins', 'store', {gameId: gameId});
        $scope.adminInfo = resp.data.result;
        $scope.saved     = true;
        $scope.changed   = false;
        $scope.saveError = '';
      },
      function (resp) {
        console.error('/admins/save', resp);
        if (resp.status == 401) {
          genericModals.showError('Fehler', 'Gegenwärtig fehlt die Berechtigung für den Zugriff auf diese Seite.', resp, function () {
            window.location.href = "/";
          });
        }
        else {
          genericModals.showError('Fehler', 'Beim Speichern der Admins trat ein Problem auf', resp);
        }
        $scope.saved     = false;
        $scope.saveError = ' der Server meldet Status ' + status + ' (' + resp.data + ')';
      });
  };

  /**
   * Any data changed
   */
  $scope.dataChanged = function () {
    $scope.saved   = false;
    $scope.changed = true;
  };

  /**
   * Load authToken when document ready
   */
  $(document).ready(function () {
    $http.get('/authtoken').then(
      function (resp) {
        authToken = resp.data.authToken;
        console.log('Auth ok');
      }, function (resp) {
        console.error('/authtoken', resp);
        genericModals.showError('Fehler', 'Die Berechtigung für diese Seite konnte nicht überpürft werden.', resp, function () {
          window.location.href = "/";
        });
      });
  });
}]);

/**
 * Angular Controller for the administrator view
 *
 * Todo: use icon for existing / not existing users
 * Todo: add info bar when there are users not existing (invite them)
 *
 * Created by kc on 15.10.15.
 */
'use strict';

angular.module('adminsApp', []).controller('adminsCtrl', ['$scope', '$http', function ($scope, $http) {
  var authToken = '';

  $scope.adminInfo = adminInfo; // contains info about the users already available
  $scope.logins = gameplay.admins.logins;
  $scope.saved = false;
  $scope.saveError = '';

  /**
   * Checks if a user is existing (known) by the ferropoly
   * @param index
   */
  $scope.isExistingUser = function(index) {
    if (_.isString($scope.logins[index]) && $scope.logins[index].length === 0) {
      return 'empty';
    }
    return _.isObject($scope.adminInfo[$scope.logins[index]]);
  };
  /**
   * Saves all admins
   */
  $scope.save = function () {
    $http.post('/admins/save', {
      gameId: gameplay.gameId,
      logins: $scope.logins,
      authToken: authToken
    }).
      success(function (data, status) {
        console.log(data);
        console.warn(status);
        if (data.success) {
          console.log('admins updated');
          // Google Analytics
          fa.event('Admins', 'store', {gameId: gameId});
          $scope.adminInfo = data.result;
          $scope.saved = true;
          $scope.saveError = '';
        }
        else {
          console.log('Error');
          console.log(data);
          $scope.saved = false;
          $scope.saveError = data.message;
        }
      }).
      error(function (data, status) {
        console.log('ERROR: ' + status);
        console.log(data);
        $scope.saved = false;
        $scope.saveError = ' der Server meldet Status ' + status + ' (' + data + ')';
      });
  };

  /**
   * Any data changed
   */
  $scope.dataChanged = function() {
    $scope.saved = false;
  };

  /**
   * Load authToken when document ready
   */
  $(document).ready(function () {
    $http.get('/authtoken').
      success(function (data) {
        authToken = data.authToken;
        console.log('Auth ok');
      }).
      error(function (data, status) {
        console.log('Auth error:');
        console.log(data);
        console.log(status);
      });
  });
}]);

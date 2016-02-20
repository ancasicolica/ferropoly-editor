/**
 * Controller for the verification
 * Created by kc on 21.06.15.
 */
'use strict';

var verificationControl = angular.module('verificationApp', ['ui.bootstrap']);

/**
 * This is the control for the sign-up process verification for ferropoly
 */
verificationControl.controller('verificationCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.verificationText = '';
  $scope.errorMessage = '';
  $scope.errorNewMessage = '';

  $scope.verifiy = function() {
    console.log($scope.verificationText);
    $http.post('/signup/verifyText' , {
      text: $scope.verificationText
    }).
      success(function (data) {
        if (data.valid) {
          console.log('OK, go on for index page');
          window.location.href = "/";
        }
        else {
          console.warn(data.message);
          $scope.errorMessage = 'Fehler! Der Server meldet: ' + data.message;
        }
      }).
      error(function (data, status) {
        console.log(status);
      });
  };

  $scope.generateNew = function() {
    $http.post('/signup/generateNewText' , {})
      .success(function (data) {
        if (data.valid) {
          console.log('OK, go on for index page');

        }
        else {
          console.warn(data.message);
          $scope.errorNewMessage = 'Fehler! Der Server meldet: ' + data.message;
        }
      }).
      error(function (data, status) {
        console.log(status);
      });
  };
}]);
console.log('LOADED');
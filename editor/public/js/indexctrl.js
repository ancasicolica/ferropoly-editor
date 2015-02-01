/**
 *
 * Created by kc on 01.02.15.
 */
'use strict';

var indexControl = angular.module('indexApp', ['ui.bootstrap']);
indexControl.controller('indexCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.gameplays = [];

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
      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.gameplays = [];
      });
  });

}]);

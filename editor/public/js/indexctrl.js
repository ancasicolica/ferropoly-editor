/**
 *
 * Created by kc on 01.02.15.
 */
'use strict';

var indexControl = angular.module('indexApp', ['ui.bootstrap']);
indexControl.controller('indexCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.gameplays = [];

  $scope.parseDate = function(ds) {
    var date = new Date(ds);
    console.log(date);
    console.log(ds);
    return date.toString("d.M.yy HH:mm");
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

        $scope.gameplays.forEach(function(gp) {
          var d = new Date(gp.log.lastEdited);
          console.log(d);
          console.log(gp.log.lastEdited);
        });
      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.gameplays = [];
      });
  });

}]);

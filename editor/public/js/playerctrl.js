/**
 * Player controller
 * Created by kc on 24.03.15.
 */
'use strict';

var playerControl = angular.module('playerApp', ['ui.bootstrap', 'ui.sortable']);
playerControl.controller('playerCtrl', ['$scope', '$http', '$interval', '$timeout', function ($scope, $http, $interval, $timeout) {

  $scope.test = 'Hello';
  $scope.players = [ {name:'team 1'} , {name:'team 2'}];
  $scope.currentTeam = undefined;

  $scope.setCurrentTeam = function(team) {
    $scope.currentTeam = team;
  };

  $scope.newPlayer = function() {
    var newGroup = { name:'Neue Gruppe' + $scope.players.length};
    $scope.players.push(newGroup);
    $scope.currentTeam = newGroup;
  };

  $scope.deletePlayer = function() {
    var i = $scope.players.indexOf($scope.currentTeam);
    if (i > -1) {
      $scope.players.splice(i, 1);
    }
    $scope.currentTeam = undefined;
  }
}]);

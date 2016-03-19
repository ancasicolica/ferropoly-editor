/**
 * New Gameplay form for Ferropoly
 *
 * Created by kc on 29.01.15.
 */
'use strict';
$.material.init();

var newGameControl = angular.module('newgameApp', ['ui.bootstrap', 'pickadate']).config(function (pickadateI18nProvider) {
  pickadateI18nProvider.translations = {
    prev: '<i class="icon-chevron-left"></i> früher',
    next: 'später <i class="icon-chevron-right"></i>'
  }
});

newGameControl.directive('convertToNumber', function () {
  return {
    require: 'ngModel',
    link   : function (scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function (val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function (val) {
        return '' + val;
      });
    }
  };
});

newGameControl.controller('newgameCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.map          = 'zvv';
  $scope.gamename     = 'Ferropoly Spiel';
  $scope.errorMessage = '';
  $scope.gamedate     = moment().add(1, 'd').format('YYYY-MM-DD');
  $scope.minDate      = moment().format('YYYY-MM-DD');
  $scope.random       = 0;
  $scope.maps         = ferropolyMaps.maps; // loaded over ferropoly api
  $scope.createEnabled = true;

  var authToken = 'none';

  /**
   * When document ready, get the auth token
   */
  $(document).ready(function () {
    $http({method: 'GET', url: '/authtoken'}).then(
      function (resp) {
        // Success promise
        authToken = resp.data.authToken;
        console.log('Auth ok');
      },
      function (resp) {
        // Error promise
        console.log('error:');
        console.log(resp);
        $scope.errorMessage = 'Authentisierungsfehler, das Spiel kann nicht erstellt werden. Status: ' + resp.status;
      });
  });

  /**
   * Create game
   */
  $scope.validateAndSave = function () {
    $scope.createEnabled = false;
    $http({
      method: 'POST',
      url   : '/gameplay/createnew',
      data  : {
        gamename : $scope.gamename,
        map      : $scope.map,
        gamedate : $scope.gamedate,
        random   : $scope.random,
        authToken: authToken
      }
    }).then(
      function (resp) {
        // Success
        console.log('Game created');
        self.location = '/gameplay/edit/' + resp.data.gameId;
        fa.event('Gameplay', 'created', resp.data.gameId);
      },
      function (resp) {
        // Error
        console.log('Error');
        console.log(data);
        $scope.errorMessage = 'Leider trat ein Fehler auf, Info:' + resp.data.message;
        fa.exception('Can not create gameplay:' + resp.data.message);
        $scope.createEnabled = true;
      }
    );
  };
}]);

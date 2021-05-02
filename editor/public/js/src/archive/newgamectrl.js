/**
 * New Gameplay form for Ferropoly
 *
 * Created by kc on 29.01.15.
 */
'use strict';
var newGameControl = angular.module('newgameApp', ['ui.bootstrap', 'pickadate']).config(function (pickadateI18nProvider) {
  pickadateI18nProvider.translations = {
    prev: '<i class="icon-chevron-left"></i> früher',
    next: 'später <i class="icon-chevron-right"></i>'
  };
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

/**
 * Allows only a-z 0-9 and '-' to be entered into the id box
 */
newGameControl.directive('createGameId', function () {
  return {
    require: 'ngModel',
    link   : function (scope, element, attrs, modelCtrl) {

      modelCtrl.$parsers.push(function (inputValue) {

        var transformedInput = inputValue.toLowerCase().replace(/[^0-9a-z-]/gi, '');

        if (transformedInput !== inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }

        return transformedInput;
      });
    }
  };
});

newGameControl.controller('newgameCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.map             = 'zvv';
  $scope.gamename        = 'Ferropoly Spiel';
  $scope.gamedate        = moment().add(1, 'd').format('YYYY-MM-DD');
  $scope.minDate         = moment().format('YYYY-MM-DD');
  $scope.random          = 0;
  $scope.maps            = ferropolyMaps.maps; // loaded over ferropoly api
  $scope.createEnabled   = true;
  $scope.step            = 1;
  $scope.gameId          = '';
  $scope.presets         = 'moderate';
  $scope.suggestedIds    = [];
  $scope.requestedGameId = '';
  $scope.requestPending  = false;

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
        console.error('/authtoken error:', resp);
        genericModals.showError('Fehler', 'Anmeldefehler, bitte neu einloggen und nochmals versuchen. Fehlermeldung: "' + resp.data + '"');
      });

    // Get a bunch of new IDs
    $http({
      method: 'POST', data: {gameId: ''}, url: '/gameplay/checkid'
    }).then(
      function (resp) {
        // Success promise
        $scope.suggestedIds    = resp.data.ids;
        $scope.requestedGameId = _.pullAt($scope.suggestedIds, [0])[0];
        console.log('suggested IDs', resp.data.ids);
      },
      function (resp) {
        // Error promise
        console.error('/checkid error:', resp);
      });

  });

  /**
   * Some kind of a workaround as the value did not change of the ng-model attached to the radio button???
   * @param t
   */
  $scope.setMap = function (t) {
    console.log(t);
    $scope.map = t.map;
  };

  /**
   * Goes to the editor
   */
  $scope.goToEditor = function () {
    self.location = '/gameplay/edit/' + $scope.gameId;
  };

  /**
   * Sets the requested ID
   * @param id
   */
  $scope.setRequestedId = function (id) {
    $scope.requestedGameId = id;
  };
  /**
   * Checks if the id is already used or not and creates the game
   */
  $scope.checkIdAndCreateGame = function () {
    $scope.requestPending = true;
    $http({
      method: 'POST', data: {gameId: $scope.requestedGameId}, url: '/gameplay/checkid'
    }).then(
      function (resp) {
        // Success promise
        if (resp.data.valid) {
          $scope.validateAndSave();
        }
        else {
          // Already taken
          genericModals.showError('Hoppla!', 'Die gewünschte Spiel-ID ist leider schon vergeben! Wir haben aber ein paar neue Vorschläge bereit');
          $scope.suggestedIds    = resp.data.ids;
          $scope.requestedGameId = _.pullAt($scope.suggestedIds, [0])[0];
          console.log('suggested IDs', resp.data.ids);
          $scope.requestPending = false;
        }
      },
      function (resp) {
        // Error promise
        console.error('/checkid error:', resp);
        genericModals.showError('Fehler', 'Die ID konnte nicht überprüft werden. Fehlermeldung: "' + resp.data + '"');
        $scope.requestPending = false;
      });
  };
  /**
   * Create game
   *
   * button.btn.btn-success(data-toggle='modal' data-target='#modal-success') TEST
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
        presets  : $scope.presets,
        gameId   : $scope.requestedGameId,
        authToken: authToken
      }
    }).then(
      function (resp) {
        // Success
        console.log('Game created');
        $scope.gameId = resp.data.gameId;
        fa.event('Gameplay', 'created', resp.data.gameId);
      },
      function (resp) {
        // Error
        console.error('/gameplay/edit/ failed', resp);
        genericModals.showError('Fehler', 'Das neue Spiel konnte nicht angelegt werden. Fehlermeldung: "' + resp.data + '"');
        fa.exception('Can not create gameplay:' + resp.data);
        $scope.createEnabled = true;
      }
    );
  };
}]);

/**
 * Pricelist controller
 * Created by kc on 21.03.15.
 */
'use strict';

var app = angular.module('pricelistApp', ['ui.bootstrap', 'ui.sortable']);

/**
 * This is the amount filter returning nicer values
 */
app.filter('amount', function () {
  return function (val) {
    if (_.isNumber(val)) {
      return val.toLocaleString('de-CH');
    }
    return val;
  }
});

app.controller('pricelistCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.test         = gameId;
  $scope.data         = undefined;
  $scope.pricelistUrl = gameUrl + '/info/' + gameId;
  $scope.joinUrl      = gameUrl + '/anmelden/' + gameId;
  $scope.finalizing   = false; // disables the button during finalization

  $scope.panel    = 'list';
  var authToken   = 'none';
  $scope.setPanel = function (panel) {
    if ($scope.panel === 'error') {
      // once in the error panel, we remain in the error panel!
      return;
    }
    $scope.panel = panel;
  };

  $scope.finalizeIt = function () {
    $scope.finalizing = true;

    $http.post('/gameplay/finalize', {
      gameId   : $scope.data.gameplay.internal.gameId,
      authToken: authToken
    }).then(
      function (resp) {
        $scope.finalizing = false;
        if (resp.data.success) {
          console.log('Gameplay finalized');
          $scope.statusText                       = resp.data.message;
          $scope.data.gameplay.internal.finalized = true;
          fa.event('Gameplay', 'finalized', $scope.data.gameplay.internal.gameId);
        }
        else {
          console.log('Error');
          console.log(resp.data);
          $scope.statusText = 'Fehler beim Speichern: ' + resp.data.message;
        }
      },
      function (resp) {
        $scope.finalizing = false;
        console.error('/gameplay/finalize failed', resp);
        $scope.statusText = 'Fehler beim Speichern: ' + resp.data.message;
      });
  };

  /**
   * After loading the document, we load the gameplay and pricelist
   */
  $(document).ready(function () {
    $http.get('/pricelist/get/' + gameId).then(
      function (resp) {
        var data = resp.data;
        if (!resp.data.success) {
          $scope.panel        = 'error';
          $scope.errorMessage = 'Der Server liefert folgende Antwort: ' + data.message;
          return;
        }
        $scope.data = data;

        $http.get('/authtoken').then(
          function (resp) {
            authToken = resp.data.authToken;
            console.log('Auth ok');
          },
          function (resp) {
            console.error('/authtoken failed', resp);
            $scope.errorMessage = 'Authentisierungsfehler, das Spiel kann nicht bearbeitet werden. Status: ' + resp.status;
          });

      },
      function (resp) {
        console.error('/pricelist/get failed', resp);
        $scope.panel        = 'error';
        $scope.errorMessage = 'Ladefehler, das Spiel kann nicht angesehen werden. Status: ' + resp.status;
      });
  });

}]);

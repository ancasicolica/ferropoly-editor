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
      function () {
        $scope.finalizing = false;
        console.log('Gameplay finalized');
        $scope.data.gameplay.internal.finalized = true;
        fa.event('Gameplay', 'finalized', $scope.data.gameplay.internal.gameId);
        genericModals.showSuccess('Preisliste finalisiert', 'Die Preisliste kann nun nicht mehr verändert werden, nun kannst Du sie den Teams zusenden.');
      },
      function (resp) {
        $scope.finalizing = false;
        console.error('/gameplay/finalize failed', resp);
        genericModals.showError('Fehler', 'Die Preisliste konnte nicht finalisiert werden.', resp, function () {
          window.location.href = "/";
        });
      });
  };

  /**
   * After loading the document, we load the gameplay and pricelist
   */
  $(document).ready(function () {
    $http.get('/pricelist/get/' + gameId).then(
      function (resp) {
        var data    = resp.data;
        $scope.data = data;

        $http.get('/authtoken').then(
          function (resp) {
            authToken = resp.data.authToken;
            console.log('Auth ok');
          },
          function (resp) {
            console.error('/authtoken failed', resp);
            genericModals.showError('Fehler', 'Authentisierungsfehler, bitte neu einloggen.', function () {
              window.location.href = "/";
            });
          });

      },
      function (resp) {
        console.error('/pricelist/get failed', resp);
        genericModals.showError('Fehler', 'Ladefehler, das Spiel kann nicht angesehen werden.', function () {
          window.location.href = "/";
        });
      });
  });

}]);

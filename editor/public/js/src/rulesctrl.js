/**
 * Ferropoly Rules controller
 * Created by kc on 19.05.15.
 */
'use strict';

var app = angular.module('rulesApp', ['ui.bootstrap', 'ui.sortable', 'wiz.markdown']);

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

app.controller('rulesCtrl', ['$scope', '$http', '$interval', '$timeout', function ($scope, $http, $interval, $timeout) {

  $scope.test = gameId;
  $scope.data = undefined;

  $scope.panel    = 'rules';
  var authToken   = 'none';
  $scope.setPanel = function (panel) {
    if ($scope.panel === 'error') {
      // once in the error panel, we remain in the error panel!
      return;
    }
    $scope.panel = panel;
  };

  /*
   Undo local changes
   */
  $scope.undoLoadedChanges = function () {
    console.warn('Unsaved changes discarded');
  };

  /**
   * Save local changes
   */
  $scope.saveLoadedChanges = function () {
    $scope.rules = $scope.unsavedRulesFound.text;
    console.log('Unsaved changes applied');
  };

  /**
   * After loading the document, we load the gameplay and pricelist
   */
  $(document).ready(function () {
    $http.get('/rules/data/' + gameId).then(
      function (resp) {
        var data = resp.data;
        $scope.data      = data;
        $scope.changelog = data.changelog;
        $scope.changelog.forEach(function (c) {
          c.ts = new Date(c.ts);
        });
        $scope.rules = data.text;

        var savedRules = localStorage.getItem(gameId + '-rules-text');
        if (savedRules && (savedRules !== $scope.rules)) {
          console.log('Local saved rules are different');
          $scope.unsavedRulesFound = {ts: localStorage.getItem(gameId + '-rules-ts'), text: savedRules};
          $('#modal-unsaved-changes').modal({show: true});
        }
        console.log('rules loaded');

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
        console.error('/rules/data failed', resp);
        $scope.panel        = 'error';
        $scope.errorMessage = 'Ladefehler, das Spiel kann nicht angesehen werden. Status: ' + resp.status;
      });
  });


  /**
   * When the window unloads, save data
   */
  $(window).unload(function () {
    localStorage.setItem(gameId + '-rules-text', $scope.rules);
    localStorage.setItem(gameId + '-rules-ts', new Date());
  });


  $scope.saveRules = function () {
    $http({
      method: 'POST',
      url   : '/rules/' + gameId,
      data  : {authToken: authToken, changes: $scope.currentRuleChanges, text: $scope.rules}
    }).then(
      function (resp) {
        console.log('Saved rules', resp);
        $scope.changelog.push({ts: new Date(), changes: $scope.currentRuleChanges})
      },
      function (resp) {
        console.error('Error while saving rules', resp);
      }
    );
  }

}]);

/**
 * Created by kc on 18.01.15.
 */

var signupControl = angular.module('signupApp', ['ui.bootstrap']);

/**
 * This is the control for the sign-up process for ferropoly
 */
signupControl.controller('signupCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
  $scope.view = 0;

  $scope.email                   = undefined;
  $scope.forename                = undefined;
  $scope.surname                 = undefined;
  $scope.password                = undefined;
  $scope.passwordVerify          = undefined;
  $scope.agbAccepted             = false;
  $scope.emailInvalid            = false;
  $scope.passwordInvalid         = false;
  $scope.passwordRepeatInvalid   = false;
  $scope.surenameInvalid         = false;
  $scope.forenameInvalid         = false;
  $scope.emailInvalidExplanation = '';
  $scope.emailSent               = false;
  /**
   * Set the validation classes
   * @param valid
   * @param id of the form element
   */
  var setValidationClasses       = function (valid, id) {
    if (valid) {
      $(id).removeClass('has-success');
      $(id).addClass('has-error');
    }
    else {
      $(id).removeClass('has-error');
      $(id).addClass('has-success');
    }
  };

  $scope.finalSendButtonDisabled = function () {
    if (!$scope.agbAccepted) {
      return true;
    }
    return $scope.emailSent;
  };
  /**
   * Result of the email verification (Socket.io handler for 'emailVerificationResult')
   * @param data
   */
  var onEmailVerificationResult  = function (data) {
    console.log(data);
    setValidationClasses(!data.valid, '#email-group');

    if (!data.valid) {
      $scope.emailInvalid = true;
      if (data.inUse) {
        $scope.emailInvalidExplanation = 'Die Email-Adresse ist bereits in Gebrauch, eine Registrierung ist nicht möglich!';
      }
      else if (data.message) {
        $scope.emailInvalidExplanation = data.message;
      }
      else if (!$scope.email || $scope.email.length === 0) {
        $scope.emailInvalidExplanation = 'Eine Email-Adresse ist notwendig.'
      }
      else {
        $scope.emailInvalidExplanation = 'Die Email-Adresse ist ungültig.'
      }
    }
    else {
      $scope.emailInvalid = false;
    }
  };

  /**
   * Initialize module when the document is ready
   */
  $(document).ready(function () {
    setAgbHeight();
    /*
     socket.on('newUserSaved', function (data) {
     // Todo: verify data
     console.log(data);
     $scope.view++;
     $scope.$apply();
     })*/
  });
  /**
   * Sets the heigth of the map as large as possible. Workaround as I haven't found a fitting css rule!
   */
  var setAgbHeight = function () {
    var dh          = $(window).height();
    var mc          = document.querySelector('#agb-box');
    var h           = dh - 195;
    mc.style.height = h.toString() + 'px';
  };
  /**
   * Verify Email Address: send request to server to do so, answer is received in 'emailVerificationResult'
   */
  $scope.verifyEmail = function () {
    $http.post('/signup/verifyemail', {
      email: $scope.email
    }).success(function (data) {
      onEmailVerificationResult(data);
    }).error(function (data, status) {
      console.log(status);
      onEmailVerificationResult(data);
    });
  };
  /**
   * Verify the forname
   */
  $scope.verifyForename = function () {
    $scope.forenameInvalid = (!$scope.forename || $scope.forename.length < 3);
    setValidationClasses($scope.forenameInvalid, '#forename-group');
  };
  /**
   * Verify the surname
   */
  $scope.verifySurname = function () {
    $scope.surnameInvalid = (!$scope.surname || $scope.surname.length < 3);
    setValidationClasses($scope.surnameInvalid, '#surname-group');
  };
  /**
   * Verify the password
   */
  $scope.verifyPassword = function () {
    $scope.passwordInvalid = (!$scope.password || $scope.password.length < 8);
    setValidationClasses($scope.passwordInvalid, '#password-group');
  };
  /**
   * Verify the repeated password
   */
  $scope.verifyRepeatPassword = function () {
    $scope.passwordRepeatInvalid = (!$scope.passwordVerify || ($scope.password !== $scope.passwordVerify));
    setValidationClasses($scope.passwordRepeatInvalid, '#password-repeat-group');
  };
  /**
   * Checks if complete form is valid
   * @returns true if valid, otherwise false
   */
  $scope.formDataValid = function () {
    if ($scope.emailInvalid ||
      $scope.passwordInvalid ||
      $scope.passwordRepeatInvalid ||
      $scope.surenameInvalid ||
      $scope.forenameInvalid) {
      return false;
    }
    return ($scope.email && $scope.forename && $scope.surname && $scope.password && $scope.passwordVerify);
  };
  /**
   * Finally creates the user
   */
  $scope.createUser = function () {
    if ($scope.formDataValid()) {
      $scope.emailSent = true;
      $http.post('/signup/new', {
        personalData: {
          forename: $scope.forename,
          surname : $scope.surname,
          email   : $scope.email
        },
        password    : $scope.password
      }).success(function (data) {
        console.log(data);
        if (data.saved) {
          $scope.emailSentSuccess = true;
        }
        else {
          $scope.emailError = data.message;
        }
        $scope.view++;
        fa.event('Signup', 'new user', $scope.email);
      }).error(function (data, status) {
        $scope.emailError = status;
        console.warn(status);
        console.log(data);
        $scope.view++;
      });
    }
  }
}]);


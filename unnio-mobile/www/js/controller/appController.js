angular.module('starter.controllers', ['ngOpenFB']);

app.controller('AppCtrl', function($scope, $rootScope, $state, ngFB) {
  $rootScope.settings = {
    range: 20, 
    public_profile: true 
  };
  $scope.fbLogout = function () {
    $state.go('login');
  };
});
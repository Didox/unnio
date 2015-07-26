angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope,  $state, $window, $firebaseObject, $firebaseArray, $ionicLoading, $filter, FIREBASECONFIG, FirebaseData) {

  var urlRef = FIREBASECONFIG.url;
  var authRef = new Firebase(urlRef);
  var authData = authRef.getAuth();
  

  $scope.checkConnections = function(uid){
    var connections = new FirebaseData('friends', uid, 'pending', 'array');
    var unwatch = connections.$watch(function(data) {
      $scope.badge = connections.length;
    });
  }

  $scope.showLoading = function(msg) {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner><p class="spinner-msg">'+msg+'</p>',
      hideOnStateChange: true
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

  $scope.logoutFb = function () {
    authRef.unauth();
    $state.go('login');
    $window.location.reload();
  };

  if (authData) {
    $scope.uid = authData.uid;
    $scope.checkConnections($scope.uid);
  } else {
    $state.go('login');
  }

});
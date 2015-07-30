angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope,  $state, $window, $ionicLoading, FIREBASECONFIG, FirebaseData, FirebaseAuthData) {

  var auth = new FirebaseAuthData();
  
  $scope.checkConnections = function(uid){
    var connections = new FirebaseData('friends', uid, 'pending', 'array');
    var unwatch = connections.$watch(function(data) {
      $scope.badgeRequests = connections.length;
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
    auth.ref.unauth();
    $state.go('login');
    $window.location.reload();
  };

  if(auth.data) {
    $scope.uid = auth.data.uid;
    $scope.checkConnections($scope.uid);
  } else {
    $state.go('login');
  }

});
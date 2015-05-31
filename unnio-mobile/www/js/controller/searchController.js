app.controller('SearchCtrl', function($scope, $rootScope ,$cordovaGeolocation, $ionicLoading){

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ios"></ion-spinner>',
      showBackdrop: false
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

  $scope.showLoading();

  $cordovaGeolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: true})
    .then(function(position) {
      $scope.geo = {
        'lat':  position.coords.latitude,
        'long': position.coords.longitude
      }
      $scope.hideLoading();
    }, function(err) {
      alert('erro' + err.message);
  });

});
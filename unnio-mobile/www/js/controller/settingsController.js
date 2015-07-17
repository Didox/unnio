app.controller('SettingsCtrl', function($scope, $state, FIREBASECONFIG) {
  
  if($scope.uid){
    $scope.showLoading();

    var userSettingsObj = $scope.getFirebaseObj('users', 'settings');

    userSettingsObj.$loaded().then(function() {
      $scope.userSettings = userSettingsObj;
      userSettingsObj.$bindTo($scope, 'userSettings');
      $scope.hideLoading();
    })
    .catch(function(error) {
      console.error('ERROR:', error);
    });

  }else{
    $state.go('login');
  }

});
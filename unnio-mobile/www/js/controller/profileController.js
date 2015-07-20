app.controller('ProfileCtrl', function($scope, $state, $firebaseObject, $ionicLoading, FIREBASECONFIG) {
  handleOpenURL("x");
  if($scope.uid){
    $scope.showLoading();

    var userProfileObj = $scope.getFirebaseObj('users', 'profile');

    userProfileObj.$loaded().then(function() {
      $scope.userProfile = userProfileObj;
      userProfileObj.$bindTo($scope, "userProfile");
      $scope.hideLoading();
    })
    .catch(function(error) {
      console.error("ERROR:", error);
    });

  }else{
    $state.go('login');
  }

});
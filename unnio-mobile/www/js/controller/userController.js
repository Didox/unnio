app.controller('UserCtrl', function($scope, $state, $stateParams) {
  $scope.showLoading(); 

  $scope.userName = $stateParams.name;
  var userUid = $stateParams.userUid;
  var userObj = $scope.getFirebaseObj(userUid, 'users', '/');
  userObj.$loaded().then(function() {
    $scope.userProfile = userObj.profile;
    $scope.userSports = userObj.sports;
    $scope.hideLoading();
  })
  .catch(function(error) {
    console.error("ERROR:", error);
  });

});
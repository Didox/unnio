app.controller('UserCtrl', function($scope, $state, $stateParams) {
  $scope.showLoading(); 

  $scope.userName = $stateParams.name;
  var userUid = $stateParams.userUid;
  var userObj = $scope.getFirebaseObj(userUid, 'users', '/');
  userObj.$loaded().then(function() {
    $scope.userProfile = userObj.profile;
    $scope.userProfile.uid = userUid;
    $scope.hideLoading();
  })
  .catch(function(error) {
    console.error("ERROR:", error);
  });

  $scope.sendRequestConnect = function(uid){
    var userLoggedConnection = $scope.getFirebaseObj($scope.uid, 'connections', uid);
    var userConnection = $scope.getFirebaseObj(uid, 'connections', $scope.uid);

    userLoggedConnection.$loaded().then(function() {
      userLoggedConnection.status = "pending";
      userLoggedConnection.$save();
    })
    .catch(function(error) {
      console.log("ERROR:", error);
    });

    userConnection.$loaded().then(function() {
      userConnection.status = "pending";
      userConnection.$save();
    })
    .catch(function(error) {
      console.log("ERROR:", error);
    });

  }

});
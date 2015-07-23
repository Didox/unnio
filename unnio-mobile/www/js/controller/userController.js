app.controller('UserCtrl', function($scope, $state, $stateParams, $ionicPopup, $timeout) {
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

  // var alertPopup = $ionicPopup.alert({
  //   title: 'Don\'t eat that!',
  //   template: 'It might taste good'
  // });

  $scope.sendRequestConnect = function(uid){
    var userLoggedConnection = $scope.getFirebaseObj($scope.uid, 'connections', uid);
    var userConnection = $scope.getFirebaseObj(uid, 'connections', $scope.uid);
    var checkCount = 0;
    userLoggedConnection.$loaded().then(function() {
      userConnection.$loaded().then(function() {

        userConnection.status = "teste";
        userLoggedConnection.status = "teste";

        userConnection.$save().then(function() {

          userLoggedConnection.$save().then(function() {
            $ionicPopup.alert({
               title: 'Request send!',
               template: 'It might taste good'
             });
          })
          .catch(function(error) {
            console.log("ERROR:", error);
          });
        })
        .catch(function(error) {
          console.log("ERROR:", error);
        });


      })
      .catch(function(error) {
        console.log("ERROR:", error);
      });
    })
    .catch(function(error) {
      console.log("ERROR:", error);
    });
  }

});
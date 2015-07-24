app.controller('UserCtrl', function($scope, $state, $stateParams, $ionicPopup, FirebaseData) {
  $scope.showLoading(); 

  $scope.userName = $stateParams.name;
  var userUid = $stateParams.userUid;
  var userObj = new FirebaseData('users', userUid, '/');

  userObj.data.$loaded().then(function() {
    $scope.userProfile = userObj.data.profile;
    $scope.userProfile.uid = userUid;
    $scope.hideLoading();
  })
  .catch(function(error) {
    console.error("ERROR:", error);
  });

  $scope.sendRequestConnect = function(uid){
    var userLoggedConnection = FirebaseData('connections', $scope.uid, uid);
    var userConnection = FirebaseData('connections', uid, $scope.uid);
    
    userLoggedConnection.data.$loaded().then(function() {
      userConnection.data.$loaded().then(function() {

        userConnection.data.status = "pending";
        userLoggedConnection.data.status = "pending";

        userConnection.data.$save().then(function() {

          userLoggedConnection.data.$save().then(function() {
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
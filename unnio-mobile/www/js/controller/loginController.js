app.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $ionicLoading, FirebaseData, FIREBASECONFIG, Auth) {
  var ref = new Firebase(FIREBASECONFIG.url);
  $scope.authObj = $firebaseAuth(ref);

  $scope.showLoading = function(msg) {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner><p class="spinner-msg">'+msg+'</p>',
      hideOnStateChange: true
    });
  };

  $scope.login = function() {
    $scope.showLoading("Aguarde");
    Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
      $scope.uid = authData.uid;
      $state.go("app.profile");
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup("facebook").then(function(authData) {
          $scope.uid = authData.uid;
          $state.go("app.profile");
        });
      } else {
        alert(error);
      }
    });
  };

  Auth.$onAuth(function(authData) {
    if (authData === null) {
      console.log("Not logged in yet");
    } else {
      $scope.uid = authData.uid;
      var userProfileObj = $firebaseObject(userData.child($scope.uid).child('profile'));
      userProfileObj.$loaded().then(function() {
        userProfileObj.name = authData.facebook.cachedUserProfile.first_name;
        userProfileObj.avatar = authData.facebook.cachedUserProfile.picture.data.url;
        userProfileObj.searchRange = userProfileObj.searchRange ? userProfileObj.searchRange : 15
        userProfileObj.$save().then(function(ref) {
           $state.go("app.profile");
        }).catch(function(error) {alert(error)});
      }).catch(function(error) {alert(error)});
  });

});

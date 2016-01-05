app.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $ionicLoading, FirebaseData, FIREBASECONFIG, Auth) {
  var ref = new Firebase(FIREBASECONFIG.url);
  $scope.authObj = $firebaseAuth(ref);

  $scope.showLoading = function(msg) {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner><p class="spinner-msg">'+msg+'</p>',
      hideOnStateChange: true
    });
  };

  $scope.logout = function(){
    $scope.authObj.$unauth();
    $state.go("login");
  }
  
  $scope.login = function() {
    $scope.showLoading("Aguarde");
    Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
      $scope.uid = authData.uid;
      $state.go("app.profile");
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup("facebook").then(function(authData) {
          $scope.uid = authData.uid;
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
      var userProfileObj = new FirebaseData('users', $scope.uid, 'profile');
      userProfileObj.$loaded().then(function() {
        userProfileObj.name = userProfileObj.name ? userProfileObj.name : authData.facebook.displayName;
        userProfileObj.avatar = authData.facebook.profileImageURL;
        userProfileObj.searchRange = userProfileObj.searchRange ? userProfileObj.searchRange : 15
        userProfileObj.$save().then(function(ref) {
          $scope.uid = authData.uid;
          $state.go("app.profile");
        }).catch(function(error) {alert(error)});
      }).catch(function(error) {alert(error)});
    }
  });

});

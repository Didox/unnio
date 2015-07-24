app.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $cordovaFacebook, FirebaseData, FIREBASECONFIG) {

  var ref = new Firebase(FIREBASECONFIG.url);
  var auth = $firebaseAuth(ref);

  $scope.loginWeb = function () {
    auth.$authWithOAuthPopup('facebook').then(function(authData) {
      $scope.uid = authData.uid;
      
      var user = FirebaseData('users', $scope.uid, '/');
      var userProfileObj = user.data;

      userProfileObj.$loaded().then(function() {
        userProfileObj.name = authData.facebook.cachedUserProfile.first_name;
        userProfileObj.avatar = authData.facebook.cachedUserProfile.picture.data.url;
        userProfileObj.searchRange = userProfileObj.searchRange ? userProfileObj.searchRange : 15
        userProfileObj.$save().then(function(ref) {
          $state.go('app.profile');
        })
        .catch(function(error) {
          console.error("ERROR:", error);
        });
      });
    }).catch(function(error) {
      console.log('ERROR:', error);
      $state.go('login');
    });

  };

});

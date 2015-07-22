app.controller('LoginCtrl', function($scope, $firebaseAuth, $state, $cordovaOauth, $firebaseObject, FIREBASECONFIG, $location) {

  var ref = new Firebase(FIREBASECONFIG.url);
  var auth = $firebaseAuth(ref);
  var userRef = FIREBASECONFIG.users;
  var userData = new Firebase(userRef);

  var onLoginComplete = function(error) {
    if (error) {
      $state.go('login');
    } else {
      $state.go('app.profile');
    }
  };

  $scope.loginWeb = function () {
    auth.$authWithOAuthPopup('facebook').then(function(authData) {
      $scope.uid = authData.uid;
      var userProfileObj = $firebaseObject(userData.child($scope.uid).child('profile'));
      userProfileObj.$loaded().then(function() {

        userProfileObj.name = authData.facebook.cachedUserProfile.first_name;
        userProfileObj.avatar = authData.facebook.cachedUserProfile.picture.data.url;
        userProfileObj.searchRange = userProfileObj.searchRange ? userProfileObj.searchRange : 15

        userProfileObj.$save().then(function(ref) {
          onLoginComplete();
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

  $scope.loginApp = function() {
    $cordovaOauth.facebook('719219301536939', ['email']).then(function(result) {
      auth.$authWithOAuthToken('facebook', result.access_token).then(function(authData) {

        $scope.uid = authData.uid;
        var userProfileObj = $firebaseObject(userData.child($scope.uid).child('profile'));
        userProfileObj.$loaded().then(function() {
          
          userProfileObj.email = authData.facebook.cachedUserProfile.email;
          userProfileObj.name = authData.facebook.cachedUserProfile.first_name;
          userProfileObj.avatar = authData.facebook.cachedUserProfile.picture.data.url;

          userProfileObj.$save().then(function(ref) {
            $state.go('app.profile');
          })
          .catch(function(error) {
            console.error("ERROR:", error);
          });
        })
        .catch(function(error) {
          console.error('ERROR: ', error);
          $state.go('login');
        });
      }).catch(function(error) {
        console.error('ERROR: ', error);
        $state.go('login');
      });
    }).catch(function(error) {
      console.log('ERROR: ', error);
      $state.go('login');
    });
  }

});

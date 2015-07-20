app.controller('LoginCtrl', function($scope, $firebaseAuth, $state, $cordovaOauth, $firebaseObject, FIREBASECONFIG, $location) {

  var ref = new Firebase(FIREBASECONFIG.url);
  var auth = $firebaseAuth(ref);
  var userRef = FIREBASECONFIG.users;
  var userData = new Firebase(userRef);

  var onLoginComplete = function(error) {
    if (error) {
      $state.go('login');
    } else {
      $scope.checkSettings();
      $state.go('app.profile');
    }
  };

  $scope.checkSettings = function() {
    if($scope.uid){
      var userSettingsObj = $firebaseObject(userData.child($scope.uid).child('settings'));
      userSettingsObj.$loaded().then(function() {
        if(userSettingsObj.range){
          $state.go('app.profile');
        }else{
          userSettingsObj.range = 15;
          userSettingsObj.public = true;
          userSettingsObj.$save().then(function(ref) {
            $state.go('app.profile');
          })
          .catch(function(error) {
            console.error("ERROR:", error);
          });
        }
      }).catch(function(error) {
        console.error("ERROR:", error);
      });
    }else{
      console.log('ERROR: uid nao definido');
      $state.go('login');
    }
  };

  $scope.loginWeb = function () {
    auth.$authWithOAuthPopup('facebook').then(function(authData) {
      $scope.uid = authData.uid;
      var userProfileObj = $firebaseObject(userData.child($scope.uid).child('profile'));
      userProfileObj.$loaded().then(function() {
        console.log(authData.facebook.cachedUserProfile);
        userProfileObj.name = authData.facebook.cachedUserProfile.first_name;
        userProfileObj.avatar = authData.facebook.cachedUserProfile.picture.data.url;
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
    $log.log($location.absUrl());
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

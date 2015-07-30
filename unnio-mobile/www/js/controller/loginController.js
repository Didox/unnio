app.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $ionicLoading, $cordovaFacebook, FirebaseData, FIREBASECONFIG) {
  var ref = new Firebase(FIREBASECONFIG.url);
  var auth = $firebaseAuth(ref);

  $scope.showLoading = function(msg) {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner><p class="spinner-msg">'+msg+'</p>',
      hideOnStateChange: true
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

  $scope.loginWeb = function () {
    $scope.showLoading("Please wait...")
    auth.$authWithOAuthPopup('facebook').then(function(authData) {
      $scope.uid = authData.uid;
      var userProfileObj = FirebaseData('users', authData.uid, 'profile');
      userProfileObj.$loaded().then(function() {
        userProfileObj.name = authData.facebook.cachedUserProfile.first_name;
        userProfileObj.avatar = authData.facebook.cachedUserProfile.picture.data.url;
        userProfileObj.searchRange = (userProfileObj.searchRange ? userProfileObj.searchRange : 20 );        
        userProfileObj.$save().then(function(ref) {
          $state.go('app.profile');
        })
        .catch(function(error) {
          console.error('ERROR:', error);
        });
      })
      .catch(function(error) {
        console.log('ERROR:', error);
      });
    }).catch(function(error) {
      console.log('ERROR:', error);
    });
  };
});

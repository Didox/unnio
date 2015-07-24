app.controller('UserCtrl', function($scope, $state, $stateParams, $ionicPopup, FirebaseData) {
  $scope.showLoading("Loading user information"); 

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
    var userLoggedConnection = FirebaseData('connections', $scope.uid, 'pending/' + uid);
    var userConnection = FirebaseData('connections', uid, 'pending/' + $scope.uid);
    
    userLoggedConnection.data.$loaded().then(function() {
      userConnection.data.$loaded().then(function() {

        $scope.popup = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type="password" ng-model="popup.msg">',
          title: 'Enter Wi-Fi Password',
          subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.popup.msg) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.popup.msg;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
          userConnection.data.status = $scope.popup.msg;
          userLoggedConnection.data.status = false;
          userConnection.data.$save().then(function() {
            userLoggedConnection.data.$save().then(function() {

            })
            .catch(function(error) {
              console.log("ERROR:", error);
            });

          })
          .catch(function(error) {
            console.log("ERROR:", error);
          });
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
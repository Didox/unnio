app.controller('UserCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, FirebaseData) {
  $scope.showLoading("Loading user information"); 

  $scope.userName = $stateParams.name;
  var userUid = $stateParams.userUid;
  var userObj = new FirebaseData('users', userUid, '/');

  userObj.$loaded().then(function() {
    $scope.userProfile = userObj.profile;
    $scope.userProfile.uid = userUid;
    $scope.hideLoading();
  })
  .catch(function(error) {
    console.error("ERROR:", error);
  });

  $ionicModal.fromTemplateUrl('templates/modal/add-friend.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.uid = $stateParams.userUid;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.sendFriendRequest = function(uid){
    var userLoggedConnection = FirebaseData('friends', $scope.uid, 'pending/' + uid);
    var userConnection = FirebaseData('friends', uid, 'pending/' + $scope.uid);
    
    userLoggedConnection.$loaded().then(function() {
      userConnection.$loaded().then(function() {
          userConnection.status = $scope.modal.msg;
          userLoggedConnection.status = false;
          userConnection.$save().then(function() {
            userLoggedConnection.$save().then(function() {
              $scope.closeModal();
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
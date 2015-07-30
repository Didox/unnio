app.controller('FriendsCtrl', function($scope, $window, $stateParams, $ionicModal, $filter, FirebaseData) {  

  $scope.showLoading('Loading friends...');

  var conectedFriendsData = [];
  var refFriends = 'friends';
  var conectedFriends = new FirebaseData(refFriends, $scope.uid, 'conected', 'array');
  
  $scope.listConfig = { 
    shouldShowDelete : false
  }

  $ionicModal.fromTemplateUrl('templates/modal/add-feedback.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(uid, authorUid) {
    $scope.modal.show();
    $scope.modal.uid = uid;
    $scope.modal.authorUid = authorUid;
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.load = function(){
    conectedFriends.$loaded().then(function(){
      angular.forEach(conectedFriends, function(value){
        var user = new FirebaseData('users', value.$id, 'profile');
        user.$loaded().then(function(){
          conectedFriendsData.push({
            uid: value.$id,
            status: value.status,
            avatar: user.avatar,
            name: (user.nickname != '' && user.nickname) ?  user.nickname : user.name
          });
        })
        .catch(function(error){
          console.log('ERROR: ', error);
        })
      });
      $scope.friends = conectedFriendsData;
      $scope.hideLoading();
      $scope.$broadcast('scroll.refreshComplete');
    })
    .catch(function(error){
      console.log('ERROR: ', error);
    });
  }

  $scope.deleteConnection = function(uid1, uid2, index, arr, type){
    $scope.showLoading("Please wait...");
    var path1 = type + '/' + uid1;
    var path2 = type + '/' + uid2;
    var userLoggedConnection = new FirebaseData('friends', uid1, path2);
    var userConnection = new FirebaseData('friends', uid2, path1);
    userLoggedConnection.$loaded().then(function(){
      userConnection.$loaded().then(function(){
        userLoggedConnection.$remove().then(function(){
          userConnection.$remove().then(function(){
            arr.splice(index,1);
            $scope.listConfig.shouldShowDelete = false;
            $scope.hideLoading();
            $scope.closeModal();
            $scope.load();
          })
          .catch(function(error){
            console.log('ERROR: ', error);
          });
        });
      })
      .catch(function(error){
        console.log('ERROR: ', error);
      });
    })
    .catch(function(error){
      console.log('ERROR: ', error);
    });
  }
  

  $scope.addFeedback = function(uid){
    $scope.showLoading("Adding feedback...");
    var feedback = {};
    var userReuptation = new FirebaseData('reputation', uid, '/', 'array');
    userReuptation.$loaded().then(function(){
      feedback.vote = $scope.modal.vote;
      feedback.message = $scope.modal.message;
      feedback.author = $scope.modal.authorUid;
      userReuptation.$add(feedback).then(function(ref) {
        $scope.hideLoading();
        $scope.closeModal();
      }).catch(function(error) {
        console.error("ERROR:", error);
      });
    }).catch(function(){
      console.log("ERROR", error);
    });
  }

  $scope.load();

  $scope.reloadRoute = function() {
    conectedFriendsData = [];
    $scope.load();
  };

});
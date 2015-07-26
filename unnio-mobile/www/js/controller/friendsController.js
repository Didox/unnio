app.controller('FriendsCtrl', function($scope, $window, $stateParams, $ionicModal, $filter, FirebaseData) {

  var refFriends = 'friends';

  $scope.listConfig = {
    shouldShowDeletePendings : false,
    shouldShowDeleteFriends : false
  }

  var pendingFriendsData = [];
  var pendingFriends = new FirebaseData(refFriends, $scope.uid, 'pending', 'array');

  var conectedFriendsData = [];
  var conectedFriends = new FirebaseData(refFriends, $scope.uid, 'conected', 'array');

  $ionicModal.fromTemplateUrl('templates/modal/add-feedback.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $ionicModal.fromTemplateUrl('templates/modal/request.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalRequest = modal;
  });


  $scope.openModalRequest = function(message) {
    console.log(message);
    $scope.modalRequest.status = message;
    $scope.modalRequest.show();
  };
  $scope.closeModalRequest = function() {
    $scope.modalRequest.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.loadFriendRequests = function(){
    $scope.showLoading('Loading friend requests...');
    pendingFriends.$loaded().then(function(){
      angular.forEach(pendingFriends, function(value){
        var user = new FirebaseData('users', value.$id, 'profile');
        user.$loaded().then(function(){
          pendingFriendsData.push({
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
      $scope.loadFriends();
      $scope.pendings = pendingFriendsData;
    })
    .catch(function(error){
      console.log('ERROR: ', error);
    });
  }

  $scope.loadFriends = function(){
    $scope.showLoading('Loading friends...');
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

  $scope.acceptConnection = function(uid, index){
    $scope.showLoading("Please wait...");
    var userLoggedConnection = new FirebaseData(refFriends, $scope.uid, 'conected');
    var userConnection = new FirebaseData(refFriends, uid, 'conected');
    
    userLoggedConnection.$loaded().then(function(){
      userConnection.$loaded().then(function(){
        userLoggedConnection[uid] = {status:true};
        userConnection[$scope.uid] = {status:true};
        userLoggedConnection.$save().then(function(){
          userConnection.$save().then(function(){
            $scope.deleteConnection(uid, $scope.uid, index, pendingFriendsData, 'pending');
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

  $scope.deleteConnection = function(uid1, uid2, index, arr, type){
    var path1 = type + '/' + uid1;
    var path2 = type + '/' + uid2;
    var userLoggedConnection = new FirebaseData(refFriends, uid1, path2);
    var userConnection = new FirebaseData(refFriends, uid2, path1);
    userLoggedConnection.$loaded().then(function(){
      userConnection.$loaded().then(function(){
        userLoggedConnection.$remove().then(function(){
          userConnection.$remove();
          arr.splice(index,1);
          $scope.listConfig = {
            shouldShowDeletePendings : false,
            shouldShowDeleteFriends : false
          }
          $scope.reloadRoute();
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
  
  $scope.loadFriendRequests();

  $scope.reloadRoute = function() {
    pendingFriendsData = [];
    conectedFriendsData = [];
    $scope.loadFriendRequests();
  };

});
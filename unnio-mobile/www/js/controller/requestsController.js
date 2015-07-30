app.controller('RequestsCtrl', function($scope, $window, $stateParams, $ionicModal, $filter, FirebaseData) {

  $scope.showLoading('Loading friends...');

  var refFriends = 'friends';
  var pendingRequestsList = [];
  var pendingRequests = new FirebaseData(refFriends, $scope.uid, 'pending', 'array');

  $scope.listConfig = { 
    shouldShowDeleteRequests : false
  }

  $ionicModal.fromTemplateUrl('templates/modal/request.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(message, uid, index) {
    if(message){
      $scope.modal.status = message;
      $scope.modal.uid = uid;
      $scope.modal.index = index;
    }
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.load = function(){
    pendingRequests.$loaded().then(function(){
      angular.forEach(pendingRequests, function(value){
        var user = new FirebaseData('users', value.$id, 'profile');
        user.$loaded().then(function(){
          pendingRequestsList.push({
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
      $scope.pendings = pendingRequestsList;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.hideLoading();
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
            $scope.deleteConnection(uid, $scope.uid, index, pendingRequestsList, 'pending');
          });
        })
        .catch(function(error){
          console.log('ERROR: ', error);
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
    $scope.showLoading("Please wait...");
    var path1 = type + '/' + uid1;
    var path2 = type + '/' + uid2;
    var userLoggedConnection = new FirebaseData('friends', uid1, path2);
    var userConnection = new FirebaseData('friends', uid2, path1);
    userLoggedConnection.$loaded().then(function(){
      userConnection.$loaded().then(function(){
        userLoggedConnection.$remove().then(function(){
          userConnection.$remove();
          arr.splice(index,1);
          $scope.listConfig = {
            shouldShowDelete : false
          }
          $scope.hideLoading();
          $scope.closeModal();
          $scope.load();
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
  
  $scope.load();

  $scope.reloadRoute = function() {
    pendingRequestsList = [];
    $scope.load();
  };

});
app.controller('ConnectionsCtrl', function($scope, $window, $stateParams, $filter, FirebaseData) {

  $scope.listConfig = {
    shouldShowDeletePendings : false,
    shouldShowDeleteConnections : false
  }

  var pendingUsers = [];
  var pendingConnections = new FirebaseData('connections', $scope.uid, 'pending', 'array');

  var conectedUsers = [];
  var activeConnections = new FirebaseData('connections', $scope.uid, 'conected', 'array');

  $scope.loadPendingConnections = function(){
    $scope.showLoading('Loading pending connections...');
    pendingConnections.data.$loaded().then(function(){
      angular.forEach(pendingConnections.data, function(value){
        var user = new FirebaseData('users', value.$id, 'profile');
        user.data.$loaded().then(function(){
          pendingUsers.push({
            uid: value.$id,
            status: value.status,
            avatar: user.data.avatar,
            name: (user.data.nickname != '' && user.data.nickname) ?  user.data.nickname : user.data.name
          });
        })
        .catch(function(error){
          console.log('ERROR: ', error);
        })
      });
      $scope.hideLoading();
      $scope.loadActiveConnections();
      $scope.pendings = pendingUsers;
    })
    .catch(function(error){
      console.log('ERROR: ', error);
    });
  }

  $scope.loadActiveConnections = function(){
    $scope.showLoading('Loading active connections...');
    activeConnections.data.$loaded().then(function(){
      angular.forEach(activeConnections.data, function(value){
        var user = new FirebaseData('users', value.$id, 'profile');
        user.data.$loaded().then(function(){
          conectedUsers.push({
            uid: value.$id,
            status: value.status,
            avatar: user.data.avatar,
            name: (user.data.nickname != '' && user.data.nickname) ?  user.data.nickname : user.data.name
          });
        })
        .catch(function(error){
          console.log('ERROR: ', error);
        })
      });
      $scope.hideLoading();
      $scope.connections = conectedUsers;
      $scope.$broadcast('scroll.refreshComplete');
    })
    .catch(function(error){
      console.log('ERROR: ', error);
    });
  }

  $scope.acceptConnection = function(uid, index){
    var userLoggedConnection = new FirebaseData('connections', $scope.uid, 'conected');
    var userConnection = new FirebaseData('connections', uid, 'conected');
    
    userLoggedConnection.data.$loaded().then(function(){
      userConnection.data.$loaded().then(function(){
        userLoggedConnection.data[uid] = {status:true};
        userConnection.data[$scope.uid] = {status:true};
        userLoggedConnection.data.$save().then(function(){
          userConnection.data.$save().then(function(){
            $scope.deleteConnection(uid, $scope.uid, index, pendingUsers, 'pending');
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
    var userLoggedConnection = new FirebaseData('connections', uid1, path2);
    var userConnection = new FirebaseData('connections', uid2, path1);
    userLoggedConnection.data.$loaded().then(function(){
      userConnection.data.$loaded().then(function(){
        userLoggedConnection.data.$remove().then(function(){
          userConnection.data.$remove();
          arr.splice(index,1);
          $scope.listConfig = {
            shouldShowDeletePendings : false,
            shouldShowDeleteConnections : false
          }
          $scope.loadPendingConnections();
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

  $scope.loadPendingConnections();

  $scope.reloadRoute = function() {
    pendingUsers = [];
    conectedUsers = [];
    $scope.loadPendingConnections();
  };

});
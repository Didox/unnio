app.controller('ConnectionsCtrl', function($scope, $stateParams, $filter, FirebaseData) {
  var pendingsUsers = [];
  var conectedUsers = [];
  $scope.listConfig = {
    shouldShowDeletePendings : false,
    shouldShowDeleteConnections : false
  }
  $scope.showLoading("Loading your connections...");
  var userConnections = new FirebaseData('connections', $scope.uid, '/', 'array');
  userConnections.data.$loaded().then(function(){
    var pendings = $filter('filter')(userConnections.data, {status: 'pending'}, true);
    angular.forEach(pendings, function(value){
      var user = new FirebaseData('users', value.$id, 'profile');
      user.data.$loaded().then(function(){
        pendingsUsers.push({
          uid: value.$id,
          avatar: user.data.avatar,
          name: (user.data.nickname != '' && user.data.nickname) ?  user.data.nickname : user.data.name
        });
      })
      .catch(function(error){
        console.log("ERROR: ", error);
      })
    });
    $scope.pendings = pendingsUsers;

    var connections = $filter('filter')(userConnections.data, {status: true}, true);
    angular.forEach(connections, function(value){
      var user = new FirebaseData('users', value.$id, 'profile');
      user.data.$loaded().then(function(){
        conectedUsers.push({
          uid: value.$id,
          avatar: user.data.avatar,
          name: (user.data.nickname != '' && user.data.nickname) ?  user.data.nickname : user.data.name
        });
      })
      .catch(function(error){
        console.log("ERROR: ", error);
      })
    });
    $scope.connections = conectedUsers;
    $scope.hideLoading();
  })
  .catch(function(error){
    console.log("ERROR: ", error);
  })
});
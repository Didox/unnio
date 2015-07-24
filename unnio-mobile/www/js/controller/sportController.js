app.controller('SportCtrl', function($scope, $stateParams, FirebaseData) {
  
  $scope.showLoading();
  $scope.sid = $stateParams;
  $scope.name = $stateParams.name;

  var sid = $stateParams.sid;
  var path = 'profile/sports/' + sid;
  var sports = new FirebaseData('users', $scope.uid, path);
  var sportObj = sports.data;

  sportObj.$loaded().then(function() {
    $scope.sport = sportObj;
    sportObj.$bindTo($scope, "sport");
    $scope.hideLoading();
  })
  .catch(function(error) {
    console.error("ERROR:", error);
  });
  
});
app.controller('SportCtrl', function($scope, $stateParams) {
  $scope.sid = $stateParams;
  //$scope.showLoading();
  $scope.name = $stateParams.name;
  var sid = $stateParams.sid;
  var path = 'profile/sports/' + sid;
  var sportObj = $scope.getFirebaseObj($scope.uid, 'users', path);

  sportObj.$loaded().then(function() {
    console.log(sportObj);
    $scope.hideLoading();
  })
  .catch(function(error) {
    console.error("ERROR:", error);
  });
});
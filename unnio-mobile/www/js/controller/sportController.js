app.controller('SportCtrl', function($scope, $stateParams, $ionicHistory) {
  $scope.showLoading();
  $scope.sid = $stateParams;
  $scope.name = $stateParams.name;
  var sid = $stateParams.sid;
  var path = 'profile/sports/' + sid;
  var sportObj = $scope.getFirebaseObj($scope.uid, 'users', path);

  sportObj.$loaded().then(function() {
    $scope.sport = sportObj;
    sportObj.$bindTo($scope, "sport");
    $scope.hideLoading();
  })
  .catch(function(error) {
    console.error("ERROR:", error);
  });

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
  
});
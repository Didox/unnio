angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $state, $window ,$firebaseAuth, $firebaseObject, $firebaseArray, $ionicLoading, $ionicModal, FIREBASECONFIG) {

  var urlRef = FIREBASECONFIG.url;
  var userRef = FIREBASECONFIG.users;
  var sportsRef = FIREBASECONFIG.sports;
  var authRef = new Firebase(urlRef);
  var authData = authRef.getAuth();

  var setRef = function(ref){
      switch(ref) {
        case 'users':
          return userRef;
        break;
        default:
          return urlRef;
      }
    }

  //Get objeto do firebase
  $scope.getFirebaseObj = function(uid, ref, child){
    var ref = setRef(ref);
    var data = new Firebase(ref);
    var obj = $firebaseObject(data.child(uid).child(child));
    return obj;
  }

  //Get array do firebase
  $scope.getFirebaseArray = function(uid, ref, child){
    var ref = setRef(ref);
    var data = new Firebase(ref);
    var arr = $firebaseArray(data.child(uid).child(child));
    return arr;
  }

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Loading...',
      hideOnStateChange: true
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

  $scope.fbLogout = function () {
    authRef.unauth();
    $state.go('login');
    $window.location.reload();
  };

  $scope.init = function(){

    $scope.setLoggedUser = function(authData){
      var user = $scope.getFirebaseObj(authData.uid, 'users', 'profile');
      user.$loaded().then(function() {
        $scope.loggedUser = user;
      })
      .catch(function(error) {
        console.error("ERROR:", error);
      });
    }

    if(authData){
      $scope.setLoggedUser(authData);
      $scope.uid = authData.uid;
    }else{
      $state.go('login');
      $window.location.reload();
    }
    
  }

  $scope.init();
  
});
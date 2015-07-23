angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope,  $state, $window, $firebaseObject, $firebaseArray, $ionicLoading, $cordovaGoogleAnalytics, FIREBASECONFIG) {

  $scope.init = function(){
    var urlRef = FIREBASECONFIG.url;
    var userRef = FIREBASECONFIG.users;
    var connectionsRef = FIREBASECONFIG.connections;
    var authRef = new Firebase(urlRef);
    var authData = authRef.getAuth();

    var setRef = function(ref){
      switch(ref) {
        case 'users':
          return userRef;
        break;
        case 'connections':
          return connectionsRef;
        break;
        default:
          return urlRef;
      }
    }

    //Função para verificar se o usuário está logado
    $scope.loggedUser = function(authData){
      if (authData) {
        return authData.uid;
      } else {
        $state.go('login');
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

    $scope.showLoading = function(msg) {
      $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner><p>'+msg+'</p>',
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

    //Chama a função para verificar usuário logado, e atribui o uid, para todo o escopo /app
    $scope.uid = $scope.loggedUser(authData);
    //$cordovaGoogleAnalytics.startTrackerWithId('UA-65523419-1');
    //$cordovaGoogleAnalytics.setUserId($scope.uid);
  }

  $scope.init();

});
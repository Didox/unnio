angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $rootScope,  $state, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $ionicLoading, $ionicModal, FIREBASECONFIG) {

  $scope.loggedUser = $rootScope.loggedUser;

  $scope.init = function(){
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

    //Função para verificar se o usuário está logado
    $scope.usuarioLogado = function(authData){
      if (authData) {
        return authData.uid;
      } else {
        $state.go('login');
        return false;
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

    //Chama a função para verificar usuário logado, e atribui o uid, para todo o escopo /app
    $scope.uid = $scope.usuarioLogado(authData);
  }

  $scope.init();

  if(!$scope.uid){
    $scope.init();
  }
  

});
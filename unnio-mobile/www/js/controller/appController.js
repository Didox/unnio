angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $state, $firebaseAuth, $firebaseObject, $ionicLoading, FIREBASECONFIG) {

  var urlRef = FIREBASECONFIG.url;
  var userRef = FIREBASECONFIG.users;
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

  //Chama a função para verificar usuário logado, e atribui o uid, para todo o escopo /app
  $scope.uid = $scope.usuarioLogado(authData);

  //Get objeto do firebase
  $scope.getFirebaseObj = function(ref, child){
    var ref = setRef(ref);
    var data = new Firebase(ref);
    var obj = $firebaseObject(data.child($scope.uid).child(child));
    return obj;
  }

  //Get objeto do firebase
  $scope.getFirebaseObjByUid = function(uid, ref, child){
    var ref = setRef(ref);
    var data = new Firebase(ref);
    var obj = $firebaseObject(data.child(uid).child(child));
    return obj;
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
    authData.$unauth();
    // $state.go('login');
  };


});
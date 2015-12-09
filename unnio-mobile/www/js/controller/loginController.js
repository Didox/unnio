app.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $ionicLoading, $timeout, FirebaseData, FIREBASECONFIG, $sanitize) {
  var ref = new Firebase(FIREBASECONFIG.url);
  $scope.authObj = $firebaseAuth(ref);

  $scope.showError = function(error){
    $ionicLoading.hide();
    switch(error) {
      case "INVALID_EMAIL":
        $scope.error = "E-mail inválido";
        break;
      case "INVALID_PASSWORD":
        $scope.error = "Senha incorreta";
        break;
      case "INVALID_USER":
        $scope.error = "E-mail não encontrado";
        break;
      case "INVALID_PASSWORD":
        $scope.error = "Senha incorreta";
        break;
      case "EMAIL_TAKEN":
        $scope.error = "E-mail já está cadastrado";
        break;
      case "EMPTY":
        $scope.error = "Todos os campos são obrigatórios";
        break;
      case "PASSWORDFAIL":
        $scope.error = "Senhas não conferem";
        break;
      default:
        $scope.error = "Ocorreu um erro, tente novamente";
        break;
    }
  };

  $scope.showMsg = function(msg){
    $ionicLoading.hide();
    switch(msg) {
      case "SUCCESS":
        $scope.msg = "Uma nova senha foi enviada para seu e-mail";
        break;
      case "USER_CREATED":
        $scope.msg = "Usuário criado com sucesso";
        break;
      default:
        $scope.msg = false;
    }
  };

  $scope.showLoading = function(msg) {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner><p class="spinner-msg">'+msg+'</p>',
      hideOnStateChange: true
    });
  };

  $scope.createUser = function(){
    if($scope.email && $scope.password && $scope.repeatpassword){
      if($scope.password == $scope.repeatpassword){
        $scope.showLoading("Aguarde...");
        $scope.authObj.$createUser({
          email    : $scope.email,
          password : $scope.password
        }).then(function(userData) {
          $scope.showMsg("USER_CREATED");
        }).catch(function(error) {
          $scope.showError(error.code);
        });
      }else{
        $scope.showError("PASSWORDFAIL");
      }
    }else{
      $scope.showError("EMPTY");
    }
  }

  $scope.resetPassword = function(){
    if($scope.email){
      $scope.authObj.$resetPassword({
        email: $scope.email
      }).then(function() {
        $scope.error = false;
        $scope.showMsg("SUCCESS")
      }).catch(function(error) {
        $scope.showError(error.code)
      });
    }else{
      $scope.showError("EMPTY");
    }
  }

  $scope.authWithPassword = function(){
    if($scope.email && $scope.password){
      $scope.showLoading("Aguarde...");
      $scope.authObj.$authWithPassword({
        email: $scope.email,
        password: $scope.password
      }).then(function(authData) {
        
        $scope.uid = authData.uid;
        var userProfileObj = FirebaseData('users', authData.uid, 'profile');
        userProfileObj.$loaded().then(function() {
          userProfileObj.searchRange = (userProfileObj.searchRange ? userProfileObj.searchRange : 20 );
          userProfileObj.avatar = (userProfileObj.avatar ? userProfileObj.avatar : "img/default-user.png");        
          userProfileObj.$save().then(function(ref) {
            $state.go('app.profile');
          })
          .catch(function(error) {
            $scope.showError(error.code);
          });
        })
        .catch(function(error) {
          $scope.showError(error.code);
        });

      }).catch(function(error) {
        $scope.showError(error.code);
      });
    }else{
      $scope.showError("EMPTY");
    }
  }

});

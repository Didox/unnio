app.controller('LoginCtrl', function($scope, $state, ngFB){

  $scope.fbLogin = function () {
    ngFB.login({scope: 'email,public_profile'}).then(
      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          console.log(response);
          $state.go('app.profile');
        } else {
          alert('Facebook login failed');
          $state.go('login');
        }
      });
  };
  
});
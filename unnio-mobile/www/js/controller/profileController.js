app.controller('ProfileCtrl', function($scope, $state, ngFB) {
  ngFB.api({
      path: '/me'
    }).then(
      function (user) {
        $scope.user = user;
        $scope.profile_image = 'http://graph.facebook.com/'+user.id+'/picture?width=270&height=270';
        $scope.user.age = $scope.age("06/03/1985"); //precisa pedir persmissao "user_birthday" para o fcebook
      },
      function (error) {
        console.log(error.error_description);
        $state.go('login');
    });

    $scope.age = function (birthday) {
      var m = birthday.split('/')[0];
      var d = birthday.split('/')[1];
      var y = birthday.split('/')[2];
      var dt = new Date,
        year = dt.getFullYear(),
        month = dt.getMonth() + 1,
        day = dt.getDate(),
        y = +y,
        m = +m,
        d = +d,
        year = year - y;
      if (month < m || month == m && day < d) {
        year--;
      }
      return year < 0 ? 0 : year;
    }
});
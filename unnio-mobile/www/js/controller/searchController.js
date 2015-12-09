app.controller('SearchCtrl', function($scope, $state, $cordovaGeolocation, $filter, FirebaseData,  FIREBASECONFIG){
  
  $scope.showLoading('Carregando perfil...');
  
  var firebaseRef = new Firebase(FIREBASECONFIG.geo);
  var geoFire = new GeoFire(firebaseRef);
  var userLoggedProfileObj = new FirebaseData('users', $scope.uid, 'profile');
  var userLoggedSports = [];

  $scope.loadLoggedUser = function(){
    userLoggedProfileObj.$loaded().then(function() {
      $scope.userLoggedProfileObj = userLoggedProfileObj;
      userLoggedProfileObj.$bindTo($scope, "userLoggedProfileObj");
      $scope.prepareSearch();
    }).catch(function(error) {
      console.error('ERROR:', error);
    });
  }

  $scope.prepareSearch = function(){
    $scope.showLoading('Obtendo localização...');
    userLoggedSports = convertSportsToArray(userLoggedProfileObj.sports);
    $cordovaGeolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false}).then(function(position) {
      geoFire.set($scope.uid, [position.coords.latitude, position.coords.longitude]).then(function() {
        var latUser = position.coords.latitude;
        var longUser = position.coords.longitude;
        var rangeUser = parseInt(userLoggedProfileObj.searchRange);
        doSearch([latUser,longUser],rangeUser);
      }).catch(function(error) {
        console.error('ERROR:', error);
      });
    }).catch(function(error) {
      console.error('ERROR:', error);
    });
  }


  var doSearch = function(geo, radius){
    var searchResults = [];
    var geoQuery = geoFire.query({
      center: geo,
      radius: parseInt(radius)
    });
    var onReadyRegistration = geoQuery.on('ready', function() {
      $scope.hideLoading();
      $scope.$broadcast('scroll.refreshComplete');
    });
    var onKeyEnteredRegistration = geoQuery.on('key_entered', function(uid, location, distance) {
      var userProfileObj = new FirebaseData('users', uid, 'profile');
      userProfileObj.$loaded().then(function() {
        var userSportsArr = convertSportsToArray(userProfileObj.sports);
        var matchResults = checkMatchBySport(userLoggedSports, userSportsArr);
        if( matchResults.match && (uid !== $scope.uid) ){
          searchResults.push({
            uid: uid, 
            location:location, 
            sports: matchResults.sports,
            distance: 'Distancia: ' + (distance > 1 ? parseInt(distance) + 'km' : 'menos de 1km'), 
            avatar: userProfileObj.avatar,
            name: (userProfileObj.nickname != '' && userProfileObj.nickname) ?  userProfileObj.nickname : userProfileObj.name
          });
          $scope.searchResults = searchResults;
        }
      })
      .catch(function(error) {
        console.error('ERROR:', error);
      });
    });
  }

  var convertSportsToArray = function(obj){
    var arr = [];
    angular.forEach(obj, function(value) {
      arr.push(value.key);
    });
    return arr;
  }

  var checkMatchBySport = function(sportsLoggedUser, sportsUser){
    var results = {};
    results.match = false;
    results.sports = [];
    angular.forEach(sportsLoggedUser, function(value) {
      if(sportsUser.indexOf(value) > -1){
        results.match = true;
        results.sports.push(value);
      }
    });
    return results;
  };

  $scope.reloadRoute = function() {
    $scope.prepareSearch(userLoggedSports);
  };

  $scope.loadLoggedUser();

});
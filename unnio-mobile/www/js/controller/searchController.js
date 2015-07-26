app.controller('SearchCtrl', function($scope, $state, $cordovaGeolocation, $filter, FirebaseData,  FIREBASECONFIG){

  var userLoggedSportsArr, searchResults = [];
  var latUser, longUser, rangeUser;

  var firebaseRef = new Firebase(FIREBASECONFIG.geo);
  var geoFire = new GeoFire(firebaseRef);
  var userLoggedProfileObj = new FirebaseData('users', $scope.uid, 'profile');

  //methods
  var prepareSearch = function(){
    $scope.showLoading('Geting geolocation...');
    userLoggedProfileObj.$loaded().then(function() {
      userLoggedSportsArr = convertSportsToArray(userLoggedProfileObj.sports);
      $cordovaGeolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false}).then(function(position) {
        geoFire.set($scope.uid, [position.coords.latitude, position.coords.longitude]).then(function() {
          latUser = position.coords.latitude;
          longUser = position.coords.longitude;
          rangeUser = parseInt(userLoggedProfileObj.searchRange);
          doSearch([latUser,longUser],rangeUser);
        })
        .catch(function(error) {
          $state.go('login')
          console.error('ERROR:', error);
        });
      })
      .catch(function(error) {
        $state.go('login')
        console.error('ERROR:', error);
      });
    })
    .catch(function(error) {
      console.error('ERROR:', error);
    });
  }
  var doSearch = function(geo, radius){
    var geoQuery = geoFire.query({
      center: geo,
      radius: radius
    });
    var onReadyRegistration = geoQuery.on('ready', function() {
      $scope.hideLoading();
      $scope.$broadcast('scroll.refreshComplete');
    });
    var onKeyEnteredRegistration = geoQuery.on('key_entered', function(uid, location, distance) {
      var userProfileObj = new FirebaseData('users', uid, 'profile');
      userProfileObj.$loaded().then(function() {
        var userSportsArr = convertSportsToArray(userProfileObj.sports);
        var matchResults = checkMatchBySport(userLoggedSportsArr, userSportsArr);
        if( matchResults.match && (uid !== $scope.uid) ){
          searchResults.push({
            uid: uid, 
            location:location, 
            sports: matchResults.sports,
            distance: 'Distance: ' + (distance > 1 ? parseInt(distance) + 'km' : 'less than 1km'), 
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
    searchResults = [];
    prepareSearch();
  };

  prepareSearch();

});
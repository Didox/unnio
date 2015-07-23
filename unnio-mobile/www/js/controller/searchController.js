app.controller('SearchCtrl', function($scope, $state, $cordovaGeolocation, $filter, FIREBASECONFIG){

  //globals
  var firebaseRef = new Firebase(FIREBASECONFIG.url).child('geo');
  var geoFire = new GeoFire(firebaseRef);

  var userLoggedProfileObj = $scope.getFirebaseObj($scope.uid, 'users', 'profile');
  var userLoggedSportsArr = [];

  var latUser, longUser, rangeUser;
  var searchResults = [];

  //methods
  var prepareSearch = function(){
    $scope.showLoading("Loading... doing a big query bro!");
    userLoggedProfileObj.$loaded().then(function() {
      userLoggedSportsArr = getUserSports(userLoggedProfileObj.sports);
      console.log($cordovaGeolocation);
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
    var onReadyRegistration = geoQuery.on("ready", function() {
      $scope.searchResults = searchResults;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.hideLoading();
    });
    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
      var userProfileObj = $scope.getFirebaseObj(key, 'users', 'profile');
      userProfileObj.$loaded().then(function() {
        var userSportsArr = getUserSports(userProfileObj.sports);
        var matchResults = checkMatchBySport(userLoggedSportsArr, userSportsArr);
        console.log(matchResults);
        if( matchResults.match && (!userProfileObj.hidden) && (key !== $scope.uid) ){
          searchResults.push({
            uid: key, 
            location:location, 
            sports: matchResults.sports,
            distance: "Distance: " + (distance > 1 ? parseInt(distance) + "km" : "less than 1km"), 
            avatar: userProfileObj.avatar,
            name: (userProfileObj.nickname != "" && userProfileObj.nickname) ?  userProfileObj.nickname : userProfileObj.name
          });
        }
      })
      .catch(function(error) {
        console.error("ERROR:", error);
      });
    });
  }
  var getUserSports = function(obj){
    var arr = [];
    angular.forEach(obj, function(value, key) {
      arr.push(value.name);
    });
    return arr;
  }
  var checkMatchBySport = function(sportsLoggedUser, sportsUser){
    var results = {};
    results.match = false;
    results.sports = [];
    angular.forEach(sportsLoggedUser, function(value, key) {
      if(sportsUser.indexOf(value) > -1){
        results.match = true;
        results.sports.push(value);
      }
    });
    if (results.match){
      return results;
    }else{
      return false;
    }
  };

  $scope.doRefresh = function() {
    searchResults = [];
    prepareSearch();
  };

  //chama funcão para busca pela primeira vez
  prepareSearch();

});
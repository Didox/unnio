app.controller('SearchCtrl', function($scope, $state, $cordovaGeolocation, $filter, FirebaseData,  FIREBASECONFIG){

  var userLoggedSportsArr, searchResults = [];
  var latUser, longUser, rangeUser;

  var firebaseRef = new Firebase(FIREBASECONFIG.geo);
  var geoFire = new GeoFire(firebaseRef);
  var userLoggedProfileObj = new FirebaseData('users', $scope.uid, 'profile');

  $scope.searchResults = searchResults;

  //methods
  var prepareSearch = function(){
    $scope.showLoading('Geting geolocation...');
    userLoggedProfileObj.data.$loaded().then(function() {
      userLoggedSportsArr = convertSportsToArray(userLoggedProfileObj.data.sports);
      $cordovaGeolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false}).then(function(position) {
        geoFire.set($scope.uid, [position.coords.latitude, position.coords.longitude]).then(function() {
          latUser = position.coords.latitude;
          longUser = position.coords.longitude;
          rangeUser = parseInt(userLoggedProfileObj.data.searchRange);
          $scope.showLoading('Serching...');
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
    var onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, location, distance) {
      
      var userProfileObj = new FirebaseData('users', key, 'profile');
      
      userProfileObj.data.$loaded().then(function() {
        var userSportsArr = convertSportsToArray(userProfileObj.data.sports);
        var matchResults = checkMatchBySport(userLoggedSportsArr, userSportsArr);

        if( matchResults.match && (!userProfileObj.data.hidden) && (key !== $scope.uid) ){
          searchResults.push({
            uid: key, 
            location:location, 
            sports: matchResults.sports,
            distance: 'Distance: ' + (distance > 1 ? parseInt(distance) + 'km' : 'less than 1km'), 
            avatar: userProfileObj.data.avatar,
            name: (userProfileObj.data.nickname != '' && userProfileObj.data.nickname) ?  userProfileObj.data.nickname : userProfileObj.data.name
          });
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

  prepareSearch();

});
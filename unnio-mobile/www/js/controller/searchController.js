app.controller('SearchCtrl', function($scope, $state, $cordovaGeolocation, FIREBASECONFIG){

  var searchResults = [];

  $scope.doSearch = function(geo, radius){
    var geoQuery = geoFire.query({
      center: geo,
      radius: radius
    });

    var onReadyRegistration = geoQuery.on("ready", function() {
      $scope.searchResults = searchResults;
      $scope.hideLoading();
    });

    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
      var userProfileObj = $scope.getFirebaseObjByUid(key, 'users', 'profile');
      userProfileObj.$loaded().then(function() {
        searchResults.push({
          key: key, 
          location:location, 
          distance: "Distance: " + (distance > 1 ? distance + "km" : "less than 1km"), 
          avatar: userProfileObj.avatar,
          name: (userProfileObj.nickname != "" && userProfileObj.nickname) ?  userProfileObj.nickname : userProfileObj.name
        });
      })
      .catch(function(error) {
        console.error("ERROR:", error);
      });
    });

    var onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location, distance) {
      console.log('removed', key);
    });

    var onKeyMovedRegistration = geoQuery.on("key_moved", function(key, location, distance) {
      console.log('moved', key, distance);
    });

  }

  $scope.showLoading();

  var firebaseRef = new Firebase(FIREBASECONFIG.url).child('geo');
  var geoFire = new GeoFire(firebaseRef);

  var userSettingsObj = $scope.getFirebaseObj('users', 'settings');
  var ref = geoFire.ref();

  userSettingsObj.$loaded().then(function() {
    $scope.userSettings = userSettingsObj;
    userSettingsObj.$bindTo($scope, 'userSettings');
    
    $cordovaGeolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false}).then(function(position) {
      geoFire.set($scope.uid, [position.coords.latitude, position.coords.longitude]).then(function() {
        $scope.doSearch([position.coords.latitude,position.coords.longitude],30);
      })
      .catch(function(error) {
        $state.go('app.settings')
        console.error('ERROR:', error);
      });
    })
    .catch(function(error) {
      $state.go('app.settings')
      console.error('ERROR:', error);
    });

  })
  .catch(function(error) {
    console.error('ERROR:', error);
  });

});
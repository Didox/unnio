angular.module('utils-service', ['firebase'])

.factory('FirebaseAuthData', function(FIREBASECONFIG){
  return function (){ 
    var authRef = new Firebase(FIREBASECONFIG.url);
    return {
      ref: authRef,
      data: authRef.getAuth()
    }
  }
})

.factory('FirebaseData', function($firebaseObject, $firebaseArray, FIREBASECONFIG){
  return function (ref, uid, path, dataType){
    var data = new Firebase(FIREBASECONFIG.url).child(ref);
    return (dataType === "array") ? $firebaseArray(data.child(uid).child(path)) : $firebaseObject(data.child(uid).child(path))
  }
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
  
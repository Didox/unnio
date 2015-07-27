angular.module('utils-service', ['firebase'])
  .factory('FirebaseData', function($firebaseObject, $firebaseArray, FIREBASECONFIG){
    var unnioRef = FIREBASECONFIG.url;
    return function (ref, uid, path, type){
      var data = new Firebase(unnioRef).child(ref);
      return (type === "array") ? $firebaseArray(data.child(uid).child(path)) : $firebaseObject(data.child(uid).child(path))
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
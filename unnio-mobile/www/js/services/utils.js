angular.module('utils-service', ['firebase'])
  .factory('FirebaseData', function($firebaseObject, $firebaseArray, FIREBASECONFIG){
    var unnioRef = FIREBASECONFIG.url;
    return function (ref, uid, path, type){
      var data = new Firebase(unnioRef).child(ref);
      return (type === "array") ? $firebaseArray(data.child(uid).child(path)) : $firebaseObject(data.child(uid).child(path))
    }
  });
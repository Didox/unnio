angular.module('utils-service', ['firebase'])
  .factory('FirebaseData', function($firebaseObject, $firebaseArray, FIREBASECONFIG){
    var urlRef = FIREBASECONFIG.url;
    var userRef = FIREBASECONFIG.users;
    var connectionsRef = FIREBASECONFIG.connections;
    var setRef = function(ref){
      switch(ref) {
        case 'users':
          return userRef;
        break;
        case 'connections':
          return connectionsRef;
        break;
        default:
          return urlRef;
      }
    }
    return function (ref, uid, path, type){
      var data = new Firebase(setRef(ref));
      return {
          data: (type === "array") ? $firebaseArray(data.child(uid).child(path)) : $firebaseObject(data.child(uid).child(path)),
          type: type
      }
    }
  });
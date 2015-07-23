app.controller('ProfileCtrl', function($scope, $state, $ionicModal, FIREBASECONFIG, SPORTS) {

  $scope.showLoading();
  var userProfileObj = $scope.getFirebaseObj($scope.uid, 'users', 'profile');
  var sportsArr = $scope.getFirebaseArray($scope.uid, 'users', 'profile/sports');

  $scope.listConfig = {
    shouldShowDelete : false
  }

  $ionicModal.fromTemplateUrl('templates/add-sport.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.options = SPORTS;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    $scope.modal.about = '';
    $scope.modal.sport = '';
    $scope.modal.level = '';
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.loadUser = function(){

    userProfileObj.$loaded().then(function() {
      $scope.userProfile = userProfileObj;
      userProfileObj.$bindTo($scope, "userProfile");
      if(!userProfileObj.sports){
        $scope.openModal();
      }
      $scope.hideLoading();
    })
    .catch(function(error) {
      console.error("ERROR:", error);
    });

    sportsArr.$loaded().then(function(x) {
      $scope.sportsArr = sportsArr;
    })
    .catch(function(error) {
      console.log("ERROR:", error);
    });

  }

  $scope.addSport = function(){    
    $scope.showLoading();
    var sport = {
      name: $scope.modal.name,
      about: $scope.modal.about ? $scope.modal.about : null,
      level: $scope.modal.level
    }
    sportsArr.$add(sport).then(function(ref) {
      $scope.hideLoading();
      $scope.closeModal();
    }).catch(function(error) {
      console.error("ERROR:", error);
    });

  }

  $scope.deleteSport = function(index){
    sportsArr.$remove(index).then(function(ref){
      // Removed
    }).catch(function(error) {
      console.error("ERROR:", error);
    });
  }

  $scope.loadUser();

});
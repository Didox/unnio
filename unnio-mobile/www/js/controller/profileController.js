app.controller('ProfileCtrl', function($scope, $state, $ionicModal, FirebaseData, SPORTS) {

  $scope.showLoading("Loading profile...");

  var sports = new FirebaseData('users', $scope.uid, 'profile/sports', 'array');
  var sportsArr = sports;

  $scope.listConfig = {
    shouldShowDelete : false
  }

  $ionicModal.fromTemplateUrl('templates/modal/add-sport.html', {
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

  $scope.loadUser = function(){
    var userProfileObj = new FirebaseData('users', $scope.uid, 'profile');
    userProfileObj.$loaded().then(function() {
      $scope.userProfile = userProfileObj;
      userProfileObj.$bindTo($scope, "userProfile");
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
    $scope.showLoading("Adding new sport...");
    $scope.modal.error = false;
    var sport = {};
    if($scope.modal.name){
      angular.forEach($scope.modal.options, function(option) {
        if($scope.modal.name == option.key){
          sport.name = option.value;
          sport.key = $scope.modal.name;
          sport.about = $scope.modal.about ? $scope.modal.about : "-";
          sport.level = $scope.modal.level ? $scope.modal.level : 1;
          sportsArr.$add(sport).then(function(ref) {
            $scope.hideLoading();
            $scope.closeModal();
          }).catch(function(error) {
            console.error("ERROR:", error);
          });
        }
      });
    }else{
      $scope.hideLoading();
      $scope.modal.error = true;
    }

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
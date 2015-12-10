app.controller('ProfileCtrl', function($scope, $localstorage, $state, $ionicModal, FirebaseData, SPORTS) {

  $scope.uname = $localstorage.get('uname');
  $scope.showLoading("Carregando perfil...");

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
  $ionicModal.fromTemplateUrl('templates/modal/add-sport.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.options = SPORTS;
  });

  var sports = new FirebaseData('users', $scope.uid, 'profile/sports', 'array');

  $scope.listConfig = {
    shouldShowDelete : false
  }

  $scope.loadUser = function(){
    var userProfileObj = new FirebaseData('users', $scope.uid, 'profile');
    userProfileObj.$loaded().then(function() {
      $scope.userProfile = userProfileObj;
      userProfileObj.$bindTo($scope, "userProfile");
        if(sports.length == 0) {
          $scope.openModal();
        };
      $scope.hideLoading();
    })
    .catch(function(error) {
      console.error("ERROR:", error);
    });

    sports.$loaded().then(function(x) {
      $scope.sports = sports;
    })
    .catch(function(error) {
      console.log("ERROR:", error);
    });

  }

  $scope.addSport = function(){    
    $scope.showLoading("Adicionando novo esporte...");
    $scope.modal.error = false;
    var sport = {};
    if($scope.modal.name){
      angular.forEach($scope.modal.options, function(option) {
        if($scope.modal.name == option.key){
          sport.name = option.value;
          sport.key = $scope.modal.name;
          sport.about = $scope.modal.about ? $scope.modal.about : "-";
          sport.level = $scope.modal.level ? $scope.modal.level : 1;
          sports.$add(sport).then(function(ref) {
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
    sports.$remove(index).then(function(ref){
      // Removed
    }).catch(function(error) {
      console.error("ERROR:", error);
    });
  }

  $scope.loadUser();

});
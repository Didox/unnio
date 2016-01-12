app.controller('ProfileCtrl', function($scope, $state, $ionicModal, FirebaseData, SPORTS) {

if($scope.uid){
  $scope.showLoading("Carregando perfil...");

  var sports = new FirebaseData('users', $scope.uid, 'profile/sports', 'array');

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
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

  $scope.listConfig = {
    shouldShowDelete : false
  }

  $scope.loadUserReputation = function(){
    var userReputation = new FirebaseData('reputation', $scope.uid, '/', 'array');
    userReputation.$loaded().then(function() {
      $scope.userReputation = userReputation.length;
    }).catch(function(error) { console.error("ERROR:", error); });
  }

  $scope.loadUser = function(){
    var userProfileObj = new FirebaseData('users', $scope.uid, 'profile');
    userProfileObj.$loaded().then(function() {
      $scope.userProfile = userProfileObj;
      userProfileObj.$bindTo($scope, "userProfile");
      $scope.loadUserReputation();
      sports.$loaded().then(function(x) {
        $scope.sports = sports;
        $scope.hideLoading();
      }).catch(function(error) { console.log("ERROR:", error); });
    }).catch(function(error) { console.error("ERROR:", error); });
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
          }).catch(function(error) { console.error("ERROR:", error); });
        }
      });
    }else{
      $scope.modal.error = true;
      $scope.hideLoading();
    }

  }

  $scope.deleteSport = function(index){
    sports.$remove(index).then(function(ref){
    }).catch(function(error) { console.error("ERROR:", error); });
  }

  $scope.loadUser();

}else{
  $state.go("login");
}

});
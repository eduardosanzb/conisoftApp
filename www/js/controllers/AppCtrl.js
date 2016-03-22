angular.module('conisoft16.controllers')
.controller('AppCtrl', AppCtrl);


function AppCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, UnAuth, $localStorage){

  $scope.logout = function(){
    console.log("Good bye");
    UnAuth.unauth();
    $localStorage.setObject('userProfile',null);
    $state.go('login');
  }
}


AppCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading","UnAuth","$localStorage"];
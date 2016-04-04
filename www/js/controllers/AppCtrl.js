angular.module('conisoft16.controllers')
.controller('AppCtrl', AppCtrl);


function AppCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, UnAuth, $localStorage){
  /*  Template:   null
     *  $state:     app
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *   - logout()
     */
  $scope.logout = function(){
    /*  STRATEGY:
     *  1. Destroy the authorization object of firebase
     *  2. Clear the $locaStorage object of the userProfile
     *  3. Redirect the app to the login state
     */
    console.log("Good bye");
    UnAuth.unauth();
    $localStorage.setObject('userProfile',null);
    $state.go('login');
  }
}
AppCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading","UnAuth","$localStorage"];
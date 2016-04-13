angular.module('conisoft16.controllers')
.controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ["$location", "$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading","UnAuth","$localStorage", "$ionicSideMenuDelegate"];
function AppCtrl($location, $rootScope, $scope, $state, $ionicModal, $ionicLoading, UnAuth, $localStorage, $ionicSideMenuDelegate){
  /*  Template:   null
     *  $state:     app
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *   - logout()
     */

    $scope.isItemActive = function(item) {
        return $location.path().indexOf(item) > -1;
    };

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

      $scope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;

}

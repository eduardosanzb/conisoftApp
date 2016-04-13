angular.module('conisoft16.controllers')
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ["$location", "$rootScope", "$scope", "$state", "$ionicScrollDelegate", "$ionicModal", "$ionicLoading", "UnAuth", "$localStorage", "$ionicSideMenuDelegate"];

function HomeCtrl($location, $rootScope, $scope, $state, $ionicScrollDelegate, $ionicModal, $ionicLoading, UnAuth, $localStorage, $ionicSideMenuDelegate) {
    /*  Template:   null
     *  $state:     app
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *   - logout()
     */


    $rootScope.home_scroll = function() {
        //$ionicScrollDelegate.$getByHandle('home_items').scrollBottom();
        $ionicScrollDelegate.scrollBy(0, document.getElementById("home-cover").height, true);
    }

    $scope.isItemActive = function(item) {
        return $location.path().indexOf(item) > -1;
    };


    $scope.logout = function() {
        /*  STRATEGY:
         *  1. Destroy the authorization object of firebase
         *  2. Clear the $locaStorage object of the userProfile
         *  3. Redirect the app to the login state
         */
        console.log("Good bye");
        UnAuth.unauth();
        $localStorage.setObject('userProfile', null);
        $state.go('login');
    }

    if ($localStorage.getObject('userProfile'))
        $scope.flag = true;
    else
        $scope.flag = false;


    $scope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;


}

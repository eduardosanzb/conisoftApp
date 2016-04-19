angular.module('conisoft16.controllers')
    .controller('AboutCtrl', AboutCtrl);

function AboutCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, NgMap, $ionicPopup, $cordovaLaunchNavigator, $cordovaInAppBrowser) {
    /*  Template:   templates/about.html
     *  $state:     app.about
     *
     *  PLUGINS:
     *  1. launchnavigator
     *  2. cordova.clipboard
     *  3. cordova.opensettings
     *  4. ionic.device
     *  5. window.open
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *  - MAP SECTION
     *      + The map object declaration
     *  - NAVIGATION SECTION
     *      + driveToUpaep()
     *      + wifiSettings
     *      + twitter()
     *      + developersInfo()
     *  - MODALS CONFIGURATION && TRIGGERS
     *      + Modal = DevelopersInfoModal
     *      + openDevelopersInfoModal()
     *      + closeDevelopersInfoModal()
     */

    /*MAP SECTION*/
    NgMap.getMap().then(function(map) {}); //-> This is the instance of the map in this view
    /*NAVIGATION SECTION*/

    /*  Strategy:
     *  1. Will trigger the navigator to the coordinates (Sala Francisco Vittoria UPAEP Puebla)
     */
    //launchnavigator.navigate([19.047918, -98.216632]);

    $scope.openNavigator = function() {
        var geoString = '';

        $scope.currentPlatform = ionic.Platform.platform();
        console.log($scope.currentPlatform);
        if (ionic.Platform.isIOS()) {
            console.log('isIOS');
            var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no'
            };

            $cordovaInAppBrowser.open('maps://?q=19.047918, -98.216632', '_system', options)
                .then(function(event) {
                    // success
                })
                .catch(function(event) {
                    // error
                });



        } else if (ionic.Platform.isAndroid()) {
            var destination = [19.047918, -98.216632];

            $cordovaLaunchNavigator.navigate(destination).then(function() {
                console.log("Navigator launched");
            }, function(err) {
                console.error(err);
            });
        }
    }





}
AboutCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "NgMap", "$ionicPopup", "$cordovaLaunchNavigator", "$cordovaInAppBrowser"];

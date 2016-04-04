angular.module('conisoft16.controllers')
    .controller('AboutCtrl', AboutCtrl);

function AboutCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, NgMap, $ionicPopup) {
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
    $scope.driveToUpaep = function() {
        /*  Strategy:
         *  1. Will trigger the navigator to the coordinates (Sala Francisco Vittoria UPAEP Puebla)
         */
        launchnavigator.navigate([19.047918, -98.216632]);
    }
    $scope.wifiSettings = function() {
        /*  Strategy:
         *  1. First will display a confirm popup, in the case of Ok
         *  2. Then will  put the password in the clipboard
         *  3. Afterwards will see if the device is android || iphone
         *  4. Will trigger the intent to the settings app
         */
        $ionicPopup.confirm({
            title: 'Connecting to Wifi',
            template: 'The Password is in the clipboard, connect to wifi: UPAEP EVENTOS'
        }).then(function(res) {
            if (res) {
                cordova.plugins.clipboard.copy("wifi_password");
                if (ionic.Platform.isIOS())
                    cordova.plugins.settings.open()
                else
                    cordova.plugins.settings.openSetting("wifi");
            } else {
                console.log("The user will not add the upaep wifi network");
            }
        })
    }
    $scope.twitter = function() {
        /*  Strategy:
         *  1. Will call the window property of the device.
         *  2. inAppBrowser will select the most suitable option to open twitter (Browser or app)
         */
        window.open('https://twitter.com/hashtag/conisoft2016', '_system', 'location=yes');
        return false;
    }
    $scope.developersInfo = function() {
        /*  Strategy:
         *  1. Open the modal for the developers info
         */
        $scope.openDevelopersInfoModal();
    }

    /*MODALS CONFIGURATION && TRIGGERS SECTION*/
    $ionicModal.fromTemplateUrl('templates/modals/developersInfo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.developersInfoModal = modal;
    });
    $scope.openDevelopersInfoModal = function() {
        $ionicLoading.show();
        $scope.developersInfoModal.show();
        $ionicLoading.hide();
    }
    $scope.closeDevelopersInfoModal = function() {
        $scope.developersInfoModal.hide();
    }

}
AboutCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "NgMap", "$ionicPopup"];
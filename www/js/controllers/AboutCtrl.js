angular.module('conisoft16.controllers')
    .controller('AboutCtrl', AboutCtrl);

function AboutCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, NgMap, $ionicPopup, $cordovaLaunchNavigator, $cordovaInAppBrowser, Wifi) {
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

     $scope.wiData = Wifi;
    
    /*MAP SECTION*/
    NgMap.getMap().then(function(map) {
        $scope.showCustomMarker= function(evt) {
            map.customMarkers.foo.setVisible(true);
            map.customMarkers.foo.setPosition(this.getPosition());
          };
          $scope.closeCustomMarker= function(evt) {
            this.style.display = 'none';
          };
    }); //-> This is the instance of the map in this view
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
    $scope.openNavigator2 = function() {
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

            $cordovaInAppBrowser.open('maps://?q=19.0491582,-98.2178273', '_system', options)
                .then(function(event) {
                    // success
                })
                .catch(function(event) {
                    // error
                });



        } else if (ionic.Platform.isAndroid()) {
            var destination = [19.0491582,-98.2178273];

            $cordovaLaunchNavigator.navigate(destination).then(function() {
                console.log("Navigator launched");
            }, function(err) {
                console.error(err);
            });
        }
    }




    $scope.wifiSettings = function() {
        /*  Strategy:
         *  1. First will display a confirm popup, in the case of Ok
         *  2. Then will  put the password in the clipboard
         *  3. Afterwards will see if the device is android || iphone
         *  4. Will trigger the intent to the settings app
         */
         
         console.log($scope.wiData)
        $ionicPopup.confirm({
            title: '<b>CONNECT WIFI</b>',
            template: 'The password is in the clipboard(texto Copiado), connect to wifi: </br><p style="text-align: center;"><b>'+ $scope.wiData.name+'</b></p>',
            buttons: [{
                text: '<b>OK</b>',
                type: 'button-calm'
            }]
        }).then(function(res) {
                cordova.plugins.clipboard.copy($scope.wiData.password);
                if (ionic.Platform.isIOS())
                    cordova.plugins.settings.open()
                else
                    cordova.plugins.settings.openSetting("wifi");
            //} else {
                //console.log("The user will not add the upaep wifi network");
            //}
        })
    }
    $scope.twitter = function() {
        /*  Strategy:
         *  1. Will call the window property of the device.
         *  2. inAppBrowser will select the most suitable option to open twitter (Browser or app)
         */
        // window.open('https://twitter.com/hashtag/conisoft2016', '_system');
        // return false;

         $cordovaInAppBrowser.open('https://twitter.com/hashtag/conisoft2016', '_blank', options)
                    .then(function(event) {
                        // success
                    })
                    .catch(function(event) {
                        // error
                    });
    }



}
AboutCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "NgMap", "$ionicPopup", "$cordovaLaunchNavigator", "$cordovaInAppBrowser","Wifi"];

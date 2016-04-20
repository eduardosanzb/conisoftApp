angular.module('conisoft16.controllers')
    .controller('ContactCtrl', ContactCtrl);

function ContactCtrl($rootScope, $scope, $state, $ionicModal, $ionicPopup,  $ionicLoading, $localStorage, $cordovaEmailComposer, $cordovaInAppBrowser,Wifi) {
    /*  Template:   templates/contact.html
     *  $state:     app.contact
     *
     *  PLUGINS:
     *  1. emailComposer
     *  2. document.location.href
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *  - sendEmail()
     *  - makeCall()
     */

     /*This is the wifi password from firebase*/
    $scope.wiData = Wifi;

    $scope.sendEmail = function() {
        /*  Strategy:
         *  1. Use the plugin email
         *  2. Add the destination of the email
         *  3. Add the subject with a translated string
         */

        $cordovaEmailComposer.isAvailable().then(function() {
            // is available
        }, function() {
            // not available
        });

        var email = {
            to: "contact.conisoft16@gmail.com",
            subject: "Conisfot contact from App",
            body: $localStorage.getObject('userProfile').uid + "</br>" + "Hello / Hola:",
            attachments: [
                'res://icon.png'
            ],
            isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function() {
            // user cancelled email
        });
        
    }
    $scope.makeCall = function() {
        /*  Strategy:
         *  1. Use the document option of the app.
         */
        document.location.href = 'tel:+1-800-555-1234';
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
        $ionicLoading.show({
            template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>{{ "login.loading" | translate}}</span>',
        });
        $scope.developersInfoModal.show();
        $ionicLoading.hide();
    }
    $scope.closeDevelopersInfoModal = function() {
        $scope.developersInfoModal.hide();
    }

    $scope.wifiSettings = function() {
        /*  Strategy:
         *  1. First will display a confirm popup, in the case of Ok
         *  2. Then will  put the password in the clipboard
         *  3. Afterwards will see if the device is android || iphone
         *  4. Will trigger the intent to the settings app
         */
         
         console.log($scope.wiData)
         console.log(Wifi)
         Wifi.$loaded().then(function(wiData){
            $ionicPopup.confirm({
            title: '<b>CONNECT WIFI</b>',
            template: 'The password is in the clipboard(texto Copiado), connect to wifi: </br><p style="text-align: center;"><b>'+ wiData.name+'</b></p>',
            buttons: [{
                text: '<b>OK</b>',
                type: 'button-calm'
            }]
        }).then(function(res) {
                cordova.plugins.clipboard.copy(wiData.password);
                if (ionic.Platform.isIOS())
                    cordova.plugins.settings.open()
                else
                    cordova.plugins.settings.openSetting("wifi");
            //} else {
                //console.log("The user will not add the upaep wifi network");
            //}
        })
         })
        
    }

    
    $scope.twitter = function(hashtag) {
        /*  Strategy:
         *  1. Will call the window property of the device.
         *  2. inAppBrowser will select the most suitable option to open twitter (Browser or app)
         */
        // window.open('https://twitter.com/hashtag/conisoft2016', '_system');
        // return false;

        var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'yes'
            };

         $cordovaInAppBrowser.open('https://twitter.com/hashtag/' + hashtag, '_system', options)
                    .then(function(event) {
                        // success
                    })
                    .catch(function(event) {
                        // error
                    });
    }
}
ContactCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicPopup", "$ionicLoading", "$localStorage", "$cordovaEmailComposer", "$cordovaInAppBrowser","Wifi"];

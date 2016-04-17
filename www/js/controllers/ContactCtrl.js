angular.module('conisoft16.controllers')
    .controller('ContactCtrl', ContactCtrl);

function ContactCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $cordovaEmailComposer) {
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
}
ContactCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$cordovaEmailComposer"];

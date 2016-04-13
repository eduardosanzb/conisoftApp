angular.module('conisoft16.controllers')
    .controller('SpeakersCtrl', SpeakersCtrl);

function SpeakersCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, speakersList, $ionicViewSwitcher, Users, $ionicHistory,$ionicPlatform) {
    /*  Template:   templates/speakers.html
     *  $state:     app.speakers
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *  - goToDetailSpeaker()
     */
    /*Controlling the back button*/
    

    
    $scope.goToDetailSpeaker = function(speakerId) {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('detailSpeaker', {
            id: speakerId,
            prevState: 'app.speakers'
        })
    }

    $ionicLoading.show({
        template: ' <ion-spinner icon="ripple" class="spinner-light"></ion-spinner><br /><span>Cargando...</span>',
    });
    speakersList.$loaded().then(function(data) {
        $scope.speakers = data;
        $ionicLoading.hide();
    });

}
SpeakersCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "speakersList", "$ionicViewSwitcher", "Users", "$ionicHistory","$ionicPlatform"];
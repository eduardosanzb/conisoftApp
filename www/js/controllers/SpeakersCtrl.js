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
    
    
    $scope.doRefresh = function() {
        /*
         *  This Function will create the refreshing stage and eventually close ir when the schedule is recreated
         *  Strategy:
         *  1.- Create the schedule with the function createTheSchedule
         *  2.- Let know the spinner that is completed
         *  3.- close the spinner
         */
        $scope.createSpeakers()
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };

    $scope.goToDetailSpeaker = function(speakerId) {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('detailSpeaker', {
            id: speakerId,
            prevState: 'app.speakers'
        })
    };
    $scope.createSpeakers = function(){
            speakersList.$loaded().then(function(data) {
            $scope.speakers = data;
            $ionicLoading.hide();
        });
    }
    
    $ionicLoading.show({
        
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>{{ "login.loading" | translate}}</span>',

    });
    $scope.createSpeakers();
    
    $scope.sort = function(){
        $scope.reverse = !$scope.reverse;
        console.log( $scope.reverse);
    }
}
SpeakersCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "speakersList", "$ionicViewSwitcher", "Users", "$ionicHistory","$ionicPlatform"];
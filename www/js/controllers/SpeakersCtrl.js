angular.module('conisoft16.controllers')
.controller('SpeakersCtrl', SpeakersCtrl);

function SpeakersCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage,speakersList,$ionicViewSwitcher){
  $scope.goToDetailSpeaker = function(speakerId) {
        console.log(speakerId);
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('detailSpeaker', {
            speakerId: speakerId,
            prevState: 'app.speakers'
        })
    }
  $scope.speakers = speakersList;
}
SpeakersCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage","speakersList","$ionicViewSwitcher"];


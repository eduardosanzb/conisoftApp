angular.module('conisoft16.controllers')
.controller('SpeakersCtrl', SpeakersCtrl);

function SpeakersCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage,speakersList,$ionicViewSwitcher, Users){
  $scope.goToDetailSpeaker = function(speakerId) {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('detailSpeaker', {
            id: speakerId,
            prevState: 'app.speakers'
        })
    }
   
    $ionicLoading.show();
    speakersList.$loaded().then(function(data){
      $scope.speakers = data;
      $ionicLoading.hide();
    });

}
SpeakersCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage","speakersList","$ionicViewSwitcher","Users"];


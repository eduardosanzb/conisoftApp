angular.module('conisoft16.controllers')
.controller('DetailSpeakerCtrl', DetailSpeakerCtrl);


function DetailSpeakerCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage,$stateParams,$ionicViewSwitcher){
  $scope.goToPrevState = function() {
        /*
         *  This Function generate the Agenda by using a service that connects to Firebase
         *      and also will retrieve the name of the speakers, because we only have the id.
         *  Strategy:
         *  1.- Retrieve all the conferences
         *  2.- ForEach conference append the speakers
         *  3.- Save in LocalStorage
         *  4.- Hide the Spinner
         */
         $ionicViewSwitcher.nextDirection('back');
         var prevState = $stateParams.prevState.split(".");
         if(prevState[0] != "app"){
            $state.go(prevState[0],{
                eventId:prevState[1],
                prevState:prevState[2]
            })
         } else {
            $state.go('app.' + prevState[1]);   
         }
        
    }
    console.log($stateParams.prevState);
}
DetailSpeakerCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage","$stateParams","$ionicViewSwitcher"];


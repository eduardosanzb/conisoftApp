angular.module('conisoft16.controllers')
    .controller('DetailSpeakerCtrl', DetailSpeakerCtrl);


function DetailSpeakerCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $stateParams, $ionicViewSwitcher, Speakers, Users) {
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
        switch(prevState[0]){
            case 'app':
                $state.go("app." + prevState[1]);
                break;
            case 'detailEvent':
                if((prevState[2] == 'detailSpeaker') || (prevState[2] == 'detailEvent')){
                   $state.go('detailEvent',{
                        id:prevState[1],
                        prevState: prevState[2] + '.' + prevState[3]
                    }); 
                } else {
                    $state.go('detailEvent',{
                        id:prevState[1],
                        prevState:'app.' + prevState[2]
                    });
                }
                break;
            case 'detailSpeaker':
               if((prevState[2] == 'detailSpeaker') || (prevState[2] == 'detailEvent')){
                   $state.go('detailSpeaker',{
                        id:prevState[1],
                        prevState: prevState[2] + '.' + prevState[3]
                    }); 
                } else {
                    $state.go('detailSpeaker',{
                        id:prevState[1],
                        prevState:'app.' + prevState[2]
                    });
                }
                break;
        }

    }
    $scope.goToDetailEvent = function(eventId) {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        var prevState = $stateParams.prevState.split(".");
        $state.go('detailEvent',{
            id:eventId,
            prevState:'detailSpeaker.'+$stateParams.id + "."+ prevState[1]+"."+prevState[1]
        })
    }

    $ionicLoading.show();
    var prevState = $stateParams.prevState.split(".");
    if(prevState[0] != 'app'){
        $scope.flagStop = true;
    }
    $scope.speaker = Speakers.get($stateParams.id);
    Speakers.allConferences($scope.speaker.$id).$loaded().then(function(data){
        $scope.speaker.conferences = data;
        $scope.user = Users.get($localStorage.getObject('userProfile').uid);
        $ionicLoading.hide();
    });

}
DetailSpeakerCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$stateParams", "$ionicViewSwitcher","Speakers", "Users"];
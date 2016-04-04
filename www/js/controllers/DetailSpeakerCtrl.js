angular.module('conisoft16.controllers')
    .controller('DetailSpeakerCtrl', DetailSpeakerCtrl);


function DetailSpeakerCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $stateParams, $ionicViewSwitcher, Speakers, Users) {
    /*  Template:   templates/detail/detailSpeaker.html
     *  $state:     detailSpeaker
     *  FUNCTIONS IN THIS CONTROLLER
     *  - NAVIGATION SECTION
     *      + goToPrevState()
     *      + goToDetailEvent(speakerId)
     *  - RETRIEVE DATA SECTION
     *      + Will fire a $ionicLoading, afaterwards will get two sections of the data:
     *        - The Event data
     *        - The User data
     *          + After success loading data, will hide the spinner
     *  - MODIFIERS OF USER SECTION
     *      + reviewConference(conferenceID)
     *      + addToAgenda()
     *      + removeFromAgenda()
     */
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
        switch (prevState[0]) {
            case 'app':
                $state.go("app." + prevState[1]);
                break;
            case 'detailEvent':
                if ((prevState[2] == 'detailSpeaker') || (prevState[2] == 'detailEvent')) {
                    $state.go('detailEvent', {
                        id: prevState[1],
                        prevState: prevState[2] + '.' + prevState[3]
                    });
                } else {
                    $state.go('detailEvent', {
                        id: prevState[1],
                        prevState: 'app.' + prevState[2]
                    });
                }
                break;
            case 'detailSpeaker':
                if ((prevState[2] == 'detailSpeaker') || (prevState[2] == 'detailEvent')) {
                    $state.go('detailSpeaker', {
                        id: prevState[1],
                        prevState: prevState[2] + '.' + prevState[3]
                    });
                } else {
                    $state.go('detailSpeaker', {
                        id: prevState[1],
                        prevState: 'app.' + prevState[2]
                    });
                }
                break;
        }

    }
    $scope.goToDetailEvent = function(eventId) {
        /*  Strategy:
         *  1. Set the direction of the navigation
         *  2. Split the parameters of the previos navigation
         *  3. choose if i have to navigate to a main view (app.something)
         *      or to a detail view (detailSomething)
         *  4. go to it, if is detail use a prevstate and an id
         *
         *  AGAIN OVER THINKED, BECAUSE I WANTED TO ACHIEVE SOMETHING MORE COMPELX BUT THEN I JUST STOP
         *   I NEED THIS ON PRODUCTION ASAP, SO I SHORT THE SCOPE OF THIS
         */
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        var prevState = $stateParams.prevState.split(".");
        $state.go('detailEvent', {
            id: eventId,
            prevState: 'detailSpeaker.' + $stateParams.id + "." + prevState[1] + "." + prevState[1]
        })
    }

    /*RETRIEVE DATA SECTION*/
    $ionicLoading.show();
    var prevState = $stateParams.prevState.split(".");
    if (prevState[0] != 'app') {
        /*  THIS VARAIBLE WILL TELL IF WE HAVE TO STOP THE NAVIGATION
         *      IF THE PREVIOUS-PREVIOUS NAVIGATION IS A DETAILSOMETHING THE NAVIGATION WILL STOP
         */
        $scope.flagStop = true;
    }
    $scope.speaker = Speakers.get($stateParams.id);
    Speakers.allConferences($scope.speaker.$id).$loaded().then(function(data) {
        $scope.speaker.conferences = data;
    });
    /*IF THE USER IS NOT LOGGED-IN WE HAVE TO BE ABLE TO LET HIM SEE ALL THE INFO.*/
    if ($localStorage.getObject('userProfile') != null) {
        Users.get($localStorage.getObject('userProfile').uid).$loaded().then(function(user) {
            $scope.user = user;
        })
    }
    $ionicLoading.hide();


}
DetailSpeakerCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$stateParams", "$ionicViewSwitcher", "Speakers", "Users"];
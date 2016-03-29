angular.module('conisoft16.controllers')
    .controller('DetailEventCtrl', DetailEventCtrl);


function DetailEventCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $stateParams, $ionicViewSwitcher, Conferences, Users) {
    /*  FUNCTIONS IN THIS CONTROLLER
     *  - NAVIGATION SECTION
     *      + goToPrevState()  -> Will get the prevstate from the $stateParams and create a $state.go() to the previous
     *  - RETRIEVE DATA SECTION
     *      + Will fire a $ionicLoading, afaterwards will get two sections of the data:
     *        - The Event data -> For filling up the view
     *        - The User data -> For deciding if we want to add/delete this event
     *          + After success loading data, will hide the spinner
     *  - MODIFIERS OF USER SECTION
     *      + addToAgenda() -> Will add the event to the agenda of the user
     *      + removeFromAgenda() -> Will delete the event form the agenda of the user
     */

    /* NAVGAION SECTION */
    $scope.goToPrevState = function() {
        /*
         *  This Function generate the Agenda by using a service taht connects to Firebase
         *      and also will retrieve the name of the speakers, because we only have the id.
         *  Strategy:
         *  1.- Retrieve all the conferences
         *  2.- ForEach conference append the speakers
         *  3.- Save in LocalStorage
         *  4.- Hide the Spinner
         */
        $ionicViewSwitcher.nextDirection('back');
        $state.go('app.' + $stateParams.prevState)
    }
    $scope.goToDetailSpeaker = function(speakerId) {
        console.log(speakerId);
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('detailSpeaker', {
            speakerId: speakerId,
            prevState: 'detailEvent.' + $stateParams.eventId + "." + $stateParams.prevState
        })
    }

    /* RETRIEVE DATA SECTION */
    $ionicLoading.show();
    $scope.eventId = $stateParams.eventId;
    Conferences.get($scope.eventId).$loaded().then(function(data) {
        $scope.event = data;
        $scope.speakers = Conferences.getSpeakers($scope.eventId);
    });
    var userId = $localStorage.getObject('userProfile').uid;
    Users.get(userId).$loaded().then(function(data) {
        $scope.user = data;
        $ionicLoading.hide();
    });

    /* MODIFIERS OF USER SECTION */
    $scope.addToAgenda = function(eventId) {
        if (!$scope.user.mySchedule) {
            console.log("No events");
            $scope.user.mySchedule = {};
        }
        $scope.user.mySchedule[eventId] = true;
        $scope.user.$save().then(function(data) {
            console.log("Conference added to my agenda" + data);
        }, function(error) {
            console.log("Error adding event to agenda: " + error);
        });
    }
    $scope.removeFromAgenda = function(eventId) {
        $scope.user.mySchedule[eventId] = null;
        $scope.user.$save().then(function(data) {
            console.log("Conference Deleted from my agenda" + data);
        }, function(error) {
            console.log("Error deleting event from agenda: " + error);
        });
    }

}
DetailEventCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$stateParams", "$ionicViewSwitcher", "Conferences", "Users"];
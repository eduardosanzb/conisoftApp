angular.module('conisoft16.controllers')
    .controller('DetailEventCtrl', DetailEventCtrl);
function DetailEventCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $stateParams, $ionicViewSwitcher, Conferences, Users, Reviews) {
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

    $scope.goToDetailSpeaker = function(speakerId) {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        var prevState = $stateParams.prevState.split(".");
        if(prevState[0] == "app"){
            $state.go('detailSpeaker', {
                id: speakerId,
                prevState: 'detailEvent.' + $stateParams.id + "." + prevState[1]
            })
        } else {
            $state.go('detailSpeaker', {
                id: speakerId,
                prevState: 'detailEvent.' + $stateParams.id + "." + prevState[0]+"."+prevState[1]
            });
        }
    }

    /* RETRIEVE DATA SECTION */
    $ionicLoading.show();

    var prevState = $stateParams.prevState.split(".");
    if(prevState[0] != 'app'){
        $scope.flagStop = true;
    }
    $scope.eventId = $stateParams.id;
    Conferences.get($scope.eventId).$loaded().then(function(data) {
        $scope.event = data;
        $scope.speakers = Conferences.getSpeakers($scope.eventId);
    });
    if($localStorage.getObject('userProfile') != null){
        var userId = $localStorage.getObject('userProfile').uid;
        Users.get(userId).$loaded().then(function(data) {
            $scope.user = data;
            console.log(data)
        });
    }
    $ionicLoading.hide();
    

    /* MODIFIERS OF USER SECTION */
    $scope.reviewConference = function(eventId){
        console.log("Reviewing")
        console.log($scope.review)
        $ionicLoading.show();
        if(!$scope.user.conferencesReviewed)
            $scope.user.conferencesReviewed = {}
        $scope.user.conferencesReviewed[eventId] = true;
        $scope.user.$save();
        var reviewObject = {
            user: $scope.user.$id,
            value: $scope.review.value,
            comment: $scope.review.comment
        }
        var newReview = Reviews.ref().child(eventId).push();
        var reviewId = newReview.key();
        Reviews.ref().child(eventId).child(reviewId).set(reviewObject);
        $scope.reviewModal.hide();
        $ionicLoading.hide();
    }

    $scope.addToAgenda = function(eventId) {
        if (!$scope.user.mySchedule) {
            console.log("No events");
            $scope.user.mySchedule = {};
        }
        Conferences.get(eventId).$loaded().then(function (event){
            if(!event.users)
                event.users = {}
            console.log(event);
            event.users[$scope.user.$id] = true;
            event.$save();
        })
        $scope.user.mySchedule[eventId] = true;
        $scope.user.$save().then(function(data) {
            console.log("Conference added to my agenda" + data);
        }, function(error) {
            console.log("Error adding event to agenda: " + error);
        });
    }
    $scope.removeFromAgenda = function(eventId) {
        Conferences.get(eventId).$loaded().then(function (event){
            event.users[$scope.user.$id] = null;
            event.$save();
        })
        $scope.user.mySchedule[eventId] = null;
        $scope.user.$save().then(function(data) {
            console.log("Conference Deleted from my agenda" + data);
        }, function(error) {
            console.log("Error deleting event from agenda: " + error);
        });
    }
    
    /* MODALS SECTION*/
    $ionicModal.fromTemplateUrl('templates/modals/reviewModal.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){
        $scope.reviewModal = modal;
    });
    $scope.openReviewModal = function(){
        $ionicLoading.show();
        $scope.review = {}
        $scope.review.value = null;
        $scope.review.comment = null;
        $scope.reviewModal.show();
        $ionicLoading.hide();
    }
}
DetailEventCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$stateParams", "$ionicViewSwitcher", "Conferences", "Users", "Reviews"];




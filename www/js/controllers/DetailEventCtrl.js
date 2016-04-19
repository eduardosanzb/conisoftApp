    angular.module('conisoft16.controllers')
    .controller('DetailEventCtrl', DetailEventCtrl);
function DetailEventCtrl($rootScope, $scope, $state, $ionicModal, $ionicScrollDelegate, $ionicLoading, $localStorage, $stateParams, $ionicViewSwitcher, Conferences, Users, Reviews) {
    /*  Template:   templates/detail/detailEvent.html
     *  $state:     detailEvent
     *  FUNCTIONS IN THIS CONTROLLER
     *  - NAVIGATION SECTION
     *      + goToPrevState()
     *      + goToDetailSpeaker(speakerId)
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

$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();


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
         *  THIS FUNCTION IS OVER PROGRAMMED, BUT IM TOOO LAZY TO REFACTOR, IS WORKING SO I'LL LEAVE IT.
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
    $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>{{ "login.loading" | translate}}</span>',
    });    var prevState = $stateParams.prevState.split(".");
    if(prevState[0] != 'app'){
        /*  THIS VARAIBLE WILL TELL IF WE HAVE TO STOP THE NAVIGATION
         *      IF THE PREVIOUS-PREVIOUS NAVIGATION IS A DETAILSOMETHING THE NAVIGATION WILL STOP
         */
        $scope.flagStop = true;
    }
    /* THIS IS THE EVENTID FROM THE PREVIOUS STATE*/
    $scope.eventId = $stateParams.id;
    /* GET THE CONFERENCE INFO UPDATED AND ALSO ALL HIS SPEAKERS*/
    Conferences.get($scope.eventId).$loaded().then(function(data) {
        $scope.event = data;
        $scope.speakers = Conferences.getSpeakers($scope.eventId);
        console.log(Conferences.getSpeakers($scope.eventId));
    });
    /*IF THE USER IS NOT LOGGED-IN WE HAVE TO BE ABLE TO LET HIM SEE ALL THE INFO.*/
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
        $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>{{ "login.loading" | translate}}</span>',
    });
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

    $scope.choose = function(eventId, choose){
        console.log(choose)
        if (choose) {
            $scope.removeFromAgenda(eventId);
        }else{
            $scope.addToAgenda(eventId);
        }
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
       
        $scope.user.mySchedule[eventId] = !$scope.user.mySchedule[eventId] ;
         Conferences.get(eventId).$loaded().then(function (event){
            event.users[$scope.user.$id] = null;
            event.$save();
        })
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
        $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>{{ "login.loading" | translate}}</span>',
    });
        $scope.review = {}
        $scope.review.value = 3;
        $scope.review.comment = null;
        $scope.reviewModal.show();
        $ionicLoading.hide();
    }
}
DetailEventCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicScrollDelegate", "$ionicLoading", "$localStorage", "$stateParams", "$ionicViewSwitcher", "Conferences", "Users", "Reviews"];




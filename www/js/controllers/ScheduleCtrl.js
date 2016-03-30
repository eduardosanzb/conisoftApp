angular.module('conisoft16.controllers')
    .controller('ScheduleCtrl', ScheduleCtrl);

ScheduleCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "Conferences", "Speakers", "$firebaseArray", "Auth", "Hours", "$ionicViewSwitcher", "agenda","Users"];

function ScheduleCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Conferences, Speakers, $firebaseArray, Auth, Hours, $ionicViewSwitcher, agenda,Users) {
    /*  FUNCTIONS IN THIS CONTROLLER
     *  - NAVIGATION SECTION
     *      + goToPrevState()  -> Will get the prevstate from the $stateParams and create a $state.go() to the previous
     *  - RETRIEVE DATA SECTION
     *      + Will fire a $ionicLoading, afterwards will get two sections of the data:
     *        - The Event data -> For filling up the view
     *        - The User data -> For deciding if we want to add/delete this event
     *          + After success loading data, will hide the spinner
     *  - MODIFIERS OF USER SECTION
     *      + addToAgenda() -> Will add the event to the agenda of the user
     *      + removeFromAgenda() -> Will delete the event form the agenda of the user
     */


    /* Functions Declarations */
    $scope.createTheSchedule = function() {
        Conferences.all().$loaded(function(conferences) {
            /*
             *  This Function generate the Agenda by using a service taht connects to Firebase
             *      and also will retrieve the name of the speakers, because we only have the id.
             *  Strategy:
             *  1.- Retrieve all the conferences
             *  2.- ForEach conference append the speakers
             *  3.- Save in LocalStorage
             *  4.- Hide the Spinner
             */
            console.log("using internet to go to Firebase");
            angular.forEach($scope.conferences, function(conference) {
                conference.speakers = Conferences.getSpeakers(conference.$id);
            });
            $scope.conferences = conferences;
            $localStorage.setObject('conferences', $scope.conferences);
        }, function(error) {
            console.log("Error: ", error)
        });
    }
    $scope.doRefresh = function() {
        /*
         *  This Function will create the refreshing stage and eventually close ir when the schedule is recreated
         *  Strategy:
         *  1.- Create the schedule with the function createTheSchedule
         *  2.- Let know the spinner that is completed
         *  3.- close the spinner
         */
        $scope.createTheSchedule()
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };
    $scope.selectDay = function(daySelected) {
        /*
         *  This function will set the variable that we will use to filter the
         *      events of the day
         */
        $scope.theDay = daySelected;
    }
    $scope.goToDetailEvent = function(eventId) {
        console.log(eventId);
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('detailEvent', {
            eventId: eventId,
            prevState: 'schedule'
        })
    }

    /*Start the Controller logic*/
    /*
     *  Strategy:
     *  1.- Set the default day to start the agenda
     *  2.- Call the service of the hours of the day
     *  3.- Check if the agenda is in cache memory; If not we will create the agenda with a function
     */
    $ionicLoading.show();
    $scope.theDay = 1461733200000; // 04/27/2016
    $scope.hours = Hours;

    if (true) { //There is internet connection
        //$scope.createTheSchedule();
        agenda.$loaded().then(function(conferences){
            conferences.forEach( function(conference){
                conference.speakers = Conferences.getSpeakers(conference.$id);
              });
          $scope.user = Users.get($localStorage.getObject('userProfile').uid)
          $scope.conferences = conferences
          $ionicLoading.hide();
        });
    } else {
        if (JSON.stringify($localStorage.getObject('conferences')) == '{}') {
            //Let know that we dont have internet and any cached data
        } else {
            $scope.conferences = $localStorage.getObject('conferences');
            $ionicLoading.hide();
        }
    }


} //END CONTROLLER
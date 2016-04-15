angular.module('conisoft16.controllers')
    .controller('MyScheduleCtrl', MyScheduleCtrl);


function MyScheduleCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Conferences, Speakers, $firebaseArray, Auth, Hours, $ionicViewSwitcher, Users, myAgenda) {
    /*  Template:   templates/mySchedule.html
     *  $state:     app.myschedule
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *  - NAVIGATION SECTION
     *      + goToDetailEvent()
     *  - MODIFIERS
     *    + selectDay(daySelected)
     *    + doRefresh
     *    +createSchedule()
     *  - DATA LOGIC SECTION
     */

    $scope.createTheSchedule = function() {
      /*  Strategy:
       *  1. Create the agenda from firebase
       */
        Users.getMySchedule($localStorage.getObject('userProfile').uid).$loaded().then( function(mySchedule){
          mySchedule.forEach( function(item){
              item.speakers = Conferences.getSpeakers(item.$id);
            });
        $scope.conferences = mySchedule

        });
    };

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

    $scope.goToDetailEvent = function(eventId) {
        /*  Strategy:
         *  1. Set the direction of the navigation
         *  4. go to it, if is detail use a prevstate and an id
         */
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('detailEvent', {
            id: eventId,
            prevState: 'app.myschedule'
        })
    }

    $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>{{ "login.loading" | translate}}</span>',
    });
    /* THIS IS THE DEFAULT DAY */
    $scope.theDay = 1461733200000; // 04/27/2016
    /* FOR THE HOURS ITEM-DIVIDERS IN THE VIEW */
    $scope.hours = Hours;
    /* THIS IS A RESOLVE SERVICE FORM THE APP.JS WITH THE AGENDA */
    myAgenda.$loaded().then( function(data){
      data.forEach( function(item){
        item.speakers = Conferences.getSpeakers(item.$id);
      });
      $scope.conferences = data

      console.log("data: ", $scope.conferences);
      $ionicLoading.hide();
    });

}
MyScheduleCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "Conferences", "Speakers", "$firebaseArray", "Auth", "Hours", "$ionicViewSwitcher", "Users", "myAgenda"];
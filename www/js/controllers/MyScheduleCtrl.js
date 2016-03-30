angular.module('conisoft16.controllers')
    .controller('MyScheduleCtrl', MyScheduleCtrl);


function MyScheduleCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Conferences, Speakers, $firebaseArray, Auth, Hours, $ionicViewSwitcher, Users, myAgenda) {


    $scope.createTheSchedule = function() {
        Users.getMySchedule($localStorage.getObject('userProfile').uid).$loaded().then( function(mySchedule){
          mySchedule.forEach( function(item){
              item.speakers = Conferences.getSpeakers(item.$id);
            });
        $scope.conferences = mySchedule
        });
    };

    $scope.selectDay = function(daySelected) {
        /*
         *  This function will set the variable that we will use to filter the
         *      events of the day
         */
        $scope.theDay = daySelected;
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

    $ionicLoading.show();
    $scope.theDay = 1461733200000; // 04/27/2016
    $scope.hours = Hours;
    myAgenda.$loaded().then( function(data){
      data.forEach( function(item){
        item.speakers = Conferences.getSpeakers(item.$id);
      });
      $scope.conferences = data
      $ionicLoading.hide();
    });

}
MyScheduleCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "Conferences", "Speakers", "$firebaseArray", "Auth", "Hours", "$ionicViewSwitcher", "Users", "myAgenda"];
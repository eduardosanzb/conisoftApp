angular.module('conisoft16.controllers')
    .controller('ScheduleCtrl', ScheduleCtrl);

ScheduleCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "Conferences", "Speakers", "$firebaseArray", "Auth"];

function ScheduleCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Conferences, Speakers, $firebaseArray, Auth) {

    var startingHour = function(milliseconds){
        var theDate = new Date();
        theDate.setTime(milliseconds);
        return theDate.getHours();
    }
    var dayOfTheEvent = function(milliseconds){
        var theDate = new Date();
        theDate.setTime(milliseconds);
        return theDate.getDate();
    }
    $scope.theDay  = dayOfTheEvent(1461733200000);
    $ionicLoading.show();

    if(false){       //There is no internet Connection
        $scope.conferences = $localStorage.getObject('conferences');
    } else {

        Conferences.all().$loaded(function(conferences) {
        /*  Strategy:
         *  1.- Retrieve all the conferences
         *  2.- ForEach conference append the speakers
         *  3.- Order them in the $scope.conferences by (day,startHour)
         *      $scope.conferences:{
         *          dayNumber:{
         *                 08:00:00:{conferences} -> 17:00:00:{conferences}
         *           }
         *       } 
         *  4.- Save in LocalStorage
        */
        
        var conferences = conferences;
        $scope.conferences = {};
        angular.forEach(conferences, function(conference) {
            conference.speakers = Conferences.getSpeakers(conference.$id);
            conference.day = dayOfTheEvent(conference.date);
            //console.log(conference);
            var startHour = startingHour(conference.date);
            if(!$scope.conferences[startHour]) $scope.conferences[startHour] = [];
            $scope.conferences[startHour].push(conference);

            
        });


        //$scope.conferences = conferences
        console.log($scope.conferences);
        $ionicLoading.hide();
    }, function(error) {
        console.log("Error: ", error)
    });
    }
    


    $scope.selectDay = function(daySelected) {
        $scope.theDay = dayOfTheEvent(daySelected);

    }

    $scope.goToDetailEvent = function(eventId) {
        console.log(eventId);
    }

}
angular.module('conisoft16.controllers')
.controller('ScheduleCtrl', ScheduleCtrl);

ScheduleCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading","$localStorage","Conferences", "Speakers", "$firebaseArray","Auth"];

function ScheduleCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Conferences, Speakers, $firebaseArray,Auth){

/* Strategy:
     *  1.- Verify if there is internet connection
     *    1.1.- If true: Download data and continue normal flow of the view
     *    1.2.- If false: Verify if we have any cached data in the $localStorage
     *      1.2.1.- If true: Just use the cached data and continue normal flow of the view
     *      1.2.2.- If false: Display an alert indicating : "There is no internet connection
     *                                                        and we dont have any cached data. Please connect"
     *  2.- The normal flow of the app will be:
     *    2.1.- Connect the firebaseObjects with the scope
     */
  Conferences.all().$loaded(function(conferences){

    $localStorage.setObject("conferences",conferences);
    $scope.conferences = conferences

    angular.forEach($scope.conferences, function(conference){
      conference.speakers = Conferences.getSpeakers(conference.$id);
      
      
    });

    console.log($scope.conferences);
  }, function(error){
    console.log("Error: ",error)
  });


// //This will call the conference and his speakers
// var ref = new Firebase("https://conisoft16.firebaseio.com/");
// ref.child("conferences/en/conference1").once('value',function(conference){
//   for(key in conference.val().speakers){
//     ref.child("speakers/en").orderByKey().equalTo(key).on('child_added', function(data){
//       //console.log(data.val());
//     });
//   }
// });

$scope.selectDay = function(daySelected){
  console.log(daySelected);
}

 $scope.goToDetailEvent = function(eventId){
  console.log(eventId);
 } 

}



angular.module('conisoft16.controllers')
.controller('ScheduleCtrl', ScheduleCtrl);

ScheduleCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading","$localStorage","Conferences", "Speakers", "$firebaseArray"];

function ScheduleCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Conferences, Speakers, $firebaseArray){


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

  
}



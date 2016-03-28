angular.module('conisoft16.controllers')
.controller('DetailEventCtrl', DetailEventCtrl);


function DetailEventCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage,$stateParams,$ionicViewSwitcher, Conferences){
  $scope.goToPrevState = function(){
    $ionicViewSwitcher.nextDirection('back'); // 'forward', 'back', etc.
    $state.go('app.'+ $stateParams.prevState )
  }
  var eventId = $stateParams.eventId;

  $scope.event = Conferences.get(eventId);
  

}
DetailEventCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage","$stateParams","$ionicViewSwitcher","Conferences"];


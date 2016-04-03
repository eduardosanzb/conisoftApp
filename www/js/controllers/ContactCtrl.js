angular.module('conisoft16.controllers')
    .controller('ContactCtrl', ContactCtrl);


function ContactCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage) {
  $scope.body
  $scope.sendEmail = function(){
    cordova.plugins.email.open({
      to: "eduardosanzb@gmail.com",
      subject: "Conisfot contact from App"
    });
  }


  $scope.makeCall = function(){
    document.location.href = 'tel:+1-800-555-1234';
  }
}
ContactCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage"];
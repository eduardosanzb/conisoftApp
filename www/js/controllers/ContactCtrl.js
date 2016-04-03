angular.module('conisoft16.controllers')
    .controller('ContactCtrl', ContactCtrl);


function ContactCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage,$cordovaEmailComposer) {

  $cordovaEmailComposer.isAvailable().then(function() {
   console.log('avaliable');
 }, function () {
   console.log('not avaliable');
 });

  //cordova.plugins.email.open();
  $cordovaEmailComposer.open();
}
ContactCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$cordovaEmailComposer"];
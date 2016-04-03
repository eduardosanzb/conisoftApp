angular.module('conisoft16.controllers')
.controller('RegisterCtrl', RegisterCtrl);


function RegisterCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Users){
  $ionicLoading.show();
  Users.get($localStorage.getObject('userProfile').uid).$loaded().then(function(user){
    $scope.user = user;
    $scope.qrText = user.$id;
    $scope.paymentStatus = user.payment.paymentStatus;
    $scope.kitDelivered = user.payment.kitDelivered;
    $ionicLoading.hide();
  });

  console.log($scope.paymentStatus)
}
RegisterCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "Users"];


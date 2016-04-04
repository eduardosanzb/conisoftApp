angular.module('conisoft16.controllers')
.controller('RegisterCtrl', RegisterCtrl);
function RegisterCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Users){
  /*  Template:   templates/register.html
     *  $state:     app.register
     *
     *
     */
  $ionicLoading.show();
  Users.get($localStorage.getObject('userProfile').uid).$loaded().then(function(user){
    $scope.user = user;
    $scope.qrText = user.$id;
    $scope.paymentStatus = user.payment.paymentStatus;
    $scope.kitDelivered = user.payment.kitDelivered;
    $ionicLoading.hide();
  });
}
RegisterCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "Users"];


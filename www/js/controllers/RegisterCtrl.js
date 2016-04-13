angular.module('conisoft16.controllers')
.controller('RegisterCtrl', RegisterCtrl);
function RegisterCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Users){
  /*  Template:   templates/register.html
     *  $state:     app.register
     *
     *
     */
    
  $scope.doRefresh = function() {
        /*
         *  This Function will create the refreshing stage and eventually close ir when the schedule is recreated
         *  Strategy:
         *  1.- Create the schedule with the function createTheSchedule
         *  2.- Let know the spinner that is completed
         *  3.- close the spinner
         */
        $scope.getData();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
  };
  $scope.getData = function() {
    
    Users.get($localStorage.getObject('userProfile').uid).$loaded().then(function(user){
      $scope.user = user;
      $scope.qrText = user.$id;
      $scope.paymentStatus = user.payment.paymentStatus;
      $scope.kitDelivered = user.payment.kitDelivered;
      $scope.profilePicture = user.profilePicture;
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show();
  $scope.getData();
  
}
RegisterCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "Users"];


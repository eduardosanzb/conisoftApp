angular.module('conisoft16.controllers')
.controller('RegisterCtrl', RegisterCtrl);
function RegisterCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, Users, $http){
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
      var url = "http://upaep.mx/micrositios/preregistro/validate2.php?ref=" + user.payment.referenceNumber + "&&cadena=46f8f95bb187c536d5aa6de4ea28a0d9af5866f194e5775243539ac7e2591ffe6beec5c14ac9e571c3ff6ce21d93496a67a346e09f95b9d11fc45e9fc2812a5b498376a395fc785aeeedd4c14c73ea368301d161320089d6a36a04d1355ab71de011bd28a7b22b586df1dd6e64f02faf"
      $http.get(url).then(function(data){
            console.log("the data is: ");
            data.data.map(function(e){
                console.log(e.RESULTADO)
                user.payment.paymentStatus = e.RESULTADO;
                user.$save();
            })
          $scope.user = user;
          $ionicLoading.hide();
            
        },function(error){
            console.log("The error is: ");
            console.log(error)
            $ionicLoading.hide();
        });
      
    });
  };

  $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>Cargando...</span>',
    });
  $scope.getData();
  
}
RegisterCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "Users","$http"];


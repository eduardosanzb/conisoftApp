angular.module('conisoft16.controllers')
.controller('ResetCtrl', ResetCtrl);


function ResetCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage,Auth,Users){
  $scope.resetPassword = function(newPassword){
    var user = $localStorage.getObject('userProfile');
    console.log(user);
    Auth.$changePassword({
        email: user.email,
        oldPassword: user.password,
        newPassword: newPassword
      }).then(function() {
        console.log("Password changed successfully!");
        Users.ref().child(user.uid).child('password').set(newPassword).then(function(){
                Auth.$authWithPassword({
                      email: user.email,
                      password: newPassword
                  }).then(function(){
                    $state.go('app.schedule');
                  }).catch(function(error){
                    console.log(error);
                    $state.go('login');
                  });
        });
        
      }).catch(function(error) {
        console.error("Error: ", error);
        Auth.$unauth();
        $state.go('login');
      });
  }
}
ResetCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage","Auth","Users"];


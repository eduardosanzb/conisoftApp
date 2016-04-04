angular.module('conisoft16.controllers')
    .controller('ReferenceCtrl', ReferenceCtrl);

function ReferenceCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, referencesList, References, Users) {
    /*  Template:   templates/reference.html
     *  $state:     reference
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *  - cancel()
     *  - addReference(referenceNumber)
     */
     $scope.cancel = function(){
        $state.go('app.schedule');
     }
    $scope.referenceNumber = "";
    $scope.addReference = function(referenceNumber) {
        /*  Strategy:
         *  1. Start the spinner
         *  2. Declare a local variable telling me that the reference is free
         *  3. Check agains all the elements in the table References if the reference had been used
         *  4. IF yes, clear the input and ask again
         *  5. If no, check the value of the reference, if exist save it to the firebase
         *  6.
         */
        $ionicLoading.show();
        var used = false;
        angular.forEach(referencesList, function(reference) {
            if (reference.value == referenceNumber) {
                var user = Users.get(reference.user)
                console.log("The reference is already used by: " + user.name);
                $scope.referenceNumber = {};
                used = true;
                $ionicLoading.hide();
            }
        });
        if (!used) {
            //Check the reference with the UPAEP api

            References.ref().child(referenceNumber).child("user").set($localStorage.getObject('userProfile').uid);
            References.ref().child(referenceNumber).child("value").set(referenceNumber);
            Users.ref().child($localStorage.getObject('userProfile').uid).child("payment").child("referenceNumber").set(referenceNumber);
            $state.go('app.register');
            $ionicLoading.hide();
        }
    }
}
ReferenceCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "referencesList", "References", "Users"];
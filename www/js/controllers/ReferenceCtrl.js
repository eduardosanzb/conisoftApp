angular.module('conisoft16.controllers')
    .controller('ReferenceCtrl', ReferenceCtrl);

function ReferenceCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, referencesList, References, Users) {
    console.log(referencesList);
    $scope.referenceNumber = "";
    $scope.addReference = function(referenceNumber) {
        $ionicLoading.show();
        var used = false;
        angular.forEach(referencesList, function(reference) {
            if (reference.value == referenceNumber) {
                var user = Users.get(reference.user)
                console.log(user)
                console.log("The reference is already used by: " + user.name);
                $scope.referenceNumber = {};
                used = true;
                $ionicLoading.hide();
            }
        });

        if (!used) {
            References.ref().child(referenceNumber).child("user").set($localStorage.getObject('userProfile').uid);
            References.ref().child(referenceNumber).child("value").set(referenceNumber);
            Users.ref().child($localStorage.getObject('userProfile').uid).child("payment").child("referenceNumber").set(referenceNumber);
            $state.go('app.register');
            $ionicLoading.hide();
        }



    }
}
ReferenceCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "referencesList", "References", "Users"];
angular.module('conisoft16.controllers')
    .controller('ReferenceCtrl', ReferenceCtrl);

function ReferenceCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, referencesList, References, Users, $http, $ionicPopup, Scholarships) {
    /*  Template:   templates/reference.html
     *  $state:     reference
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *  - cancel()
     *  - addReference(referenceNumber)
     */
    $scope.cancel = function(){
        /*  Strategy:
         *  1. When canceling the login you will be redirect to the schedule without a login
         */
        $state.go('app.schedule');
    }
    $scope.number = {};
    $scope.addScholarship = function(scholarshipNumber) {       
       Scholarships.get(scholarshipNumber).$loaded()
       .then(function(data){
            console.log(data)
            if(data.status != null){
                if(data.status){
                    Scholarships.ref().child(scholarshipNumber).child("status").set(false);
                    Users.ref().child($localStorage.getObject('userProfile').uid).child("scholarship").set(true);
                    Users.ref().child($localStorage.getObject('userProfile').uid).child("payment").child("referenceNumber").set(scholarshipNumber);
                    $state.go('app.register');
                }
                else{
                    $ionicPopup.alert({
                        title: "This scholarship is already in use",
                        template: "Try again please"
                    }).then(function(res){
                        $scope.number = {};
                    });
                }

            } else {
                $ionicPopup.alert({
                        title: "This scholarship does not exist",
                        template: "Try again please"
                    }).then(function(res){
                        $scope.number = {};
                    });
            }
       })
       .catch(function(error){
        console.log(error);
       });

        

    }
    $scope.addReference = function(referenceNumber) {
        /*  Strategy:
         *  1. Start the spinner
         *  2. Declare a local variable telling me that the reference is free
         *  3. Check agains all the elements in the table References if the reference had been used
         *  4. IF yes, clear the input and ask again
         *  5. If no, check the value of the reference, if exist save it to the firebase
         *  6.
         */
        var url = "http://upaep.mx/micrositios/preregistro/validate2.php?ref=" + referenceNumber + "&&cadena=e41723625f5ae2514d064f684d79836fd1c1835896a2d143ac30c1ac98b256c9564cee7ee855d4ba5bbf11bd17571795f93682930762f074af356236cdcd01ed638bc6c93a2082ad58f1478b97b97b2a59bc458aa5732dd9e53fe58e507de10f0d2a07c5ada3ae619a7e3393c7ef96a9"
        var url2 = "http://upaep.mx/micrositios/preregistro/validate2.php?ref=05700003343889ID1&&cadena=00bfbad873a34daa1f46cc1af772873e534af2ea38e28b2a10044dea3bba1724419457abd26ebfd7ff5f47ebcba14b87"
        console.log(referenceNumber);
        //05840000094436ID9
        //$ionicLoading.show();
        $http.get(url).then(function(data){
            console.log("the data is: ");
            console.log(data)
            if(data.data == ""){
                 $ionicPopup.alert({
                    title: "This Reference does not exist",
                    template: "Try again please"
                }).then(function(res){
                    $scope.number = {};
                });
                
             } else {
                if(data.data != "null"){
                    data.data.map(function(e){
                        validatingTheReference(referenceNumber,e.RESULTADO);
                    })
                } else {
                    validatingTheReference(referenceNumber,0);
                }

                
             }
            
        },function(error){
            console.log("The error is: ");
            console.log(error)
        });
            }

    var validatingTheReference = function(referenceNumber, status) {
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
            Users.ref().child($localStorage.getObject('userProfile').uid).child("payment").child("paymentStatus").set(status);
            $state.go('app.register');
            $ionicLoading.hide();
        }
    }

    
}
ReferenceCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "referencesList", "References", "Users", "$http", "$ionicPopup", "Scholarships"];







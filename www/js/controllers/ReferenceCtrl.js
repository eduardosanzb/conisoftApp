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

     /*CODE FOR ADD SCHOLARSHIPS*/
         /* Strategy:
          * 1. IN a foor loop i will create a new scholarship insert into firebase
          * 2. Now we will set the status of the new scholarship to false
          */
         for (var i = 0; i < 10; i++) {
             var newScholar = Scholarships.ref().push();
            var id = newScholar.key();
            Scholarships.ref().child(id).child("status").set(true);
         }
     


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
                    $ionicPopup.confirm({
                        title: "This scholarship is already in use",
                        template: "Try again please",
                        buttons: [
                                    {
                                        text: '<b>OK</b>',
                                        type: 'button-calm'
                                    }
                                ]
                    }).then(function(res){
                        $scope.number = {};
                    });
                }

            } else {
                $ionicPopup.confirm({
                        title: "This scholarship does not exist",
                        template: "Try again please",
                        buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-calm'
                }]
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
        var url = "http://upaep.mx/micrositios/preregistro/validate2.php?ref=" + referenceNumber + "&&cadena=46f8f95bb187c536d5aa6de4ea28a0d9af5866f194e5775243539ac7e2591ffe6beec5c14ac9e571c3ff6ce21d93496a67a346e09f95b9d11fc45e9fc2812a5b498376a395fc785aeeedd4c14c73ea368301d161320089d6a36a04d1355ab71de011bd28a7b22b586df1dd6e64f02faf"
        var url2 = "http://upaep.mx/micrositios/preregistro/validate2.php?ref=05700003343889ID1&&cadena=00bfbad873a34daa1f46cc1af772873e534af2ea38e28b2a10044dea3bba1724419457abd26ebfd7ff5f47ebcba14b87"
        console.log(referenceNumber);
        //05840000094436ID9
        $ionicLoading.show({
            template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>{{ "login.loading" | translate}}</span>',
        });
        $http.get(url).then(function(data){
            console.log("the data is: ");
            console.log(data)
            if(data.data == ""){
                $ionicLoading.hide();
                 $ionicPopup.confirm({
                    title: "This Reference does not exist",
                    template: "Try again please",
                          buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-calm'
                }]
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
                console.log("The reference is already used by: ");
                $ionicPopup.confirm({
                    title: "The reference is already used",
                    template: "Try again please",
                          buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-calm'
                }]
                }).then(function(res){
                    $scope.number = {};
                });
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







angular.module('conisoft16.controllers')
    .controller('LoginCtrl', LoginCtrl);

function LoginCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $ionicSlideBoxDelegate, $ionicPopup, Countries, $ionicFilterBar, References, Auth, Users, $http) {

    // var GetMethod = {
    //     method: 'POST',
    //     url: 'http://upaep.mx/micrositios/preregistro/validate.php',
    //     params: ''
    // };
    // var url = 'http://upaep.mx/micrositios/preregistro/validate.php';
    // var data = {
    //     ref: '05870000000054EX5', 
    //     cadena: "e41723625f5ae2514d064f684d79836fd1c1835896a2d143ac30c1ac98b256c9564cee7ee855d4ba5bbf11bd17571795f93682930762f074af356236cdcd01ed638bc6c93a2082ad58f1478b97b97b2a59bc458aa5732dd9e53fe58e507de10f0d2a07c5ada3ae619a7e3393c7ef96a9"
    // };

    // $http.post(url,data).success(function(data){
    //     console.log(data);
    // }).error(function(error){
    //     console.log(error);
    // });

    // $http(GetMethod).success(function(data){
    //     console.log(data);
    // }).error(function(error){
    //     console.log(error);
    // });

   

    var filterBarInstance;

    $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.countries,
            update: function(filteredItems, filterText) {
                $scope.countries = filteredItems;
                if (filterText) {
                    console.log(filterText);
                }
            },
            cancel: function(){

            },
            done: function(){
                //$scope.closeFilterBar();
            }
        });
    console.log(filterBarInstance);

    };


    $scope.closeFilterBar = function() {
        if(filterBarInstance){
            filterBarInstance();
            filterBarInstance = null;
        }
        
    };

    $scope.refreshItems = function() {
        if (filterBarInstance) {
            filterBarInstance();
            filterBarInstance = null;
        }
    }

    $scope.login = function(user) {
        $scope.authData = null;
        $scope.error = null;

        console.log(user);
        Auth.$authWithPassword({
            email: user.email,
            password: user.password
        }).then(function(data) {
            console.log(data);
            Users.get(data.auth.uid).$loaded().then(function(data){
                var user = {
                    uid: data.$id,
                    name: data.name + " " + data.surname,
                    email: data.email,
                    payment: data.payment
                  }
                console.log(user);
                $localStorage.setObject('userProfile',user);
                $scope.selectModal.hide();
                $state.go('app.schedule');
              });

        }).catch(function(error) {
            console.log("Error login the user,  " + error);
        });
    }

    $scope.createUser = function() {
        console.log($scope.user);
        var newUser = {
            email: $scope.user.email,
            password: $scope.user.password,
            name: $scope.user.name,
            afiliation: $scope.user.afiliation,
            conferences: {},
            location: {
                country: $scope.user.country,
                state: $scope.user.state
            },
            payment: {
                validation: false,
                referenceNumber: false,
                registerFlag:false
            },
            my_conferences:{}
        }

        Auth.$createUser(newUser).then(function(userData) {
            console.log("User created with uid: " + userData.uid);
            Users.ref().child(userData.uid).set(newUser);
            console.log("User data stored: " + Users.get(userData.uid));
            $scope.login(newUser);
        }).catch(function(error) {
            console.log("Error creating the user, " + error);
        });

    }
    

    $scope.closeLogin = function() {
        $state.go('app.schedule')
    }




    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.selectModal = modal;
        $scope.selectModalSlider = $ionicSlideBoxDelegate.$getByHandle('modalSlider');
        $scope.selectModalSlider.enableSlide(false);
    });


    $scope.closeModal = function() {
        if ($scope.selectModalSlider.currentIndex() == 0) {
            $scope.user = {};
            $scope.selectModal.hide();
        } else {
            $scope.selectModalSlider.previous();
        }
    };

    $scope.openModal = function() {
        $scope.selectModalSlider.slide(0);
        $scope.user = {};
        $scope.user.afiliation = null;
        $scope.secondPage = true;
        $scope.user.state = "n/a"
        $scope.selectModal.show();
        console.log($scope.form);
    };

    $scope.nextPage = function(user) {
        $ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
    };







    $ionicModal.fromTemplateUrl('templates/countriesModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.selectCountryModal = modal;

    });
    $scope.closeCountryModal = function() {
        $scope.closeFilterBar();
        $scope.selectCountryModal.hide();
    };
    $scope.openCountryModal = function() {
        $ionicLoading.show();
        Countries.all().$loaded().then(function(data){
            console.log(data);
            $scope.countries = data;
            $ionicLoading.hide();
            $scope.selectCountryModal.show();
        });
    };
    $scope.countrySelected = function(countryId, countryKey) {
        console.log(countryId);
        console.log(countryKey);
        $scope.user.country = countryKey.name.common;
        $scope.mxFlag = (countryKey.name.common == "Mexico") ? true : false;
        $scope.closeCountryModal();
    }

    $ionicModal.fromTemplateUrl('templates/statesModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.selectStateModal = modal;

    });
    $scope.closeStateModal = function() {
        $scope.selectStateModal.hide();
    };
    $scope.openStateModal = function() {
        $ionicLoading.show();
        Countries.mx().$loaded().then(function(data){
            $scope.states = data;
            $ionicLoading.hide();
            $scope.selectStateModal.show();
        });
        
    };
    $scope.stateSelected = function(state) {
        $scope.user.state = state.nombre;
        $scope.closeStateModal();
    }

    $ionicModal.fromTemplateUrl('templates/modalitiesModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalitiesModal = modal;

    });
    $scope.closeModalitiesModal = function() {
        $scope.modalitiesModal.hide();
    };
    $scope.openModalitiesModal = function() {
        $scope.modalitiesModal.show();
    };
    $scope.modalitySelected = function(modality) {
        $scope.user.modality = modality.Name;
        $scope.closeModalitiesModal();
        console.log($scope.user);
        console.log($scope);
    }

}
LoginCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$ionicSlideBoxDelegate", "$ionicPopup", "Countries", "$ionicFilterBar", "References", "Auth", "Users", "$http"];
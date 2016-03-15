angular.module('conisoft16.controllers')
    .controller('LoginCtrl', LoginCtrl);

function LoginCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $ionicSlideBoxDelegate, $ionicPopup, Countries, $ionicFilterBar, References, Auth, Users) {


    var filterBarInstance;

    $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.countries,
            update: function(filteredItems, filterText) {
                $scope.countries = filteredItems;
                if (filterText) {
                    console.log(filterText);
                }
            }
        });
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

        Auth.$authWithPassword({
            email: user.email,
            password: user.password
        }).then(function(authData) {
            console.log("User loged with data: " + authData);
            $state.go('app.schedule');
            //save the user from the firm to the localStorage
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
            surname: $scope.user.surname,
            afiliation: $scope.user.afiliation,
            conferences: {},
            location: {
                country: $scope.user.country,
                state: $scope.user.state
            },
            modality: $scope.user.modality,
            payment: {
                validation: false,
                voucherImage: false
            }
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
    /* Strategy:
     *  1.- Verify if there is a user logged in
     *    1.1.- If true: Continue with the schedule.html
     *    1.2.- If false: Continue with step 2
     *  2.- Verify if there is internet connection
     *    2.1.- If true: Let the user login or register
     *    2.2.- If false: Display alert: "Cannot continue, because we dont have internet connection"
     *  3.- The normal flow of the app will be:
     *    3.1.- Connect the firebaseObjects with the scope
     */



    //if ($rootScope.thereIsInternetConnection){
    if (true) {
        //strategy step 1.1
        $scope.countries = Countries.all();
        $scope.states = Countries.mx();
        $scope.modalities = References.all();
        $localStorage.set('countriesFlag', true);
        $localStorage.setObject('countries', $scope.countries);
        $localStorage.setObject('mxStates', $scope.states);
        $scope.user = {};

    } else {
        $ionicPopup.confirm({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
        }).then(function(result) {
            if (!result) {
                ionic.Platform.exitApp();
            }
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
        $scope.form = {};
        $scope.user.state = "n/a"
        $scope.selectModal.show();
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
        $scope.selectCountryModal.hide();
    };
    $scope.openCountryModal = function() {
        console.log($scope.countries);
        $scope.selectCountryModal.show();
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
        $scope.selectStateModal.show();
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
LoginCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$ionicSlideBoxDelegate", "$ionicPopup", "Countries", "$ionicFilterBar", "References", "Auth", "Users"];
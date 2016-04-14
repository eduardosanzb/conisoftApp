angular.module('conisoft16.controllers')
    .controller('LoginCtrl', LoginCtrl);

function LoginCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $ionicSlideBoxDelegate, $ionicPopup, Countries, $ionicFilterBar, References, Auth, Users, $http) {
 /*  Template:   templates/login.html
     *  $state:     app.login
     *  FUNCTIONS IN THIS CONTROLLER
     *  - LOGIN / SIGNUP / RESETPASSWORD SECTION
     *      + resetPassword(userEmail) -> Will fire up a FBAuth object for reset a password and will send an email with a temp pass.
     *      + login(user)   -> with an email & password will create a firebaseAuth connection && AuthObject
     *      + createUser()  -> With the data in the $scope.user will create an user in the FB and then will fireup login(user)
     *      + closeLogin()  -> Just close the login and go to the state.('app.schedule')
     *  - FILTER BAR SECTION
     *      + showFilterBar() -> Will instanciate a bar when called it.
     *      + closeFilterBar() -> Will destroy the instantiation of the filterBar
     *  - MODAL SETTING UP SECTION
     *      + All modals have an open && close function.
     *      + Some of them have a selected from the modal (Country && State)
     *    Modals:
     *      + Signup
     *      + Countries
     *          - Will retrieve the data form the FB with a promise
     *      + States
     *          - Will retrieve the data form the FB with a promise
     *      + ResetPassword
     */

     console.log($localStorage.getObject('userProfile'));
     var test = $localStorage.getObject('userProfile');
     if(test == null)
        console.log("it is null");
    if(test == '{}')
        console.log('{}')
    if(test == {})
        console.log('wtf')

 /*LOGIN / SIGNUP / RESETPASSWORD SECTION*/
    $scope.resetPassword = function(userEmail) {
        $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>Loading...</span>',
    });
        Auth.$resetPassword({
            email: userEmail
        }).then(function() {
            console.log("password reset succesful");
            // An alert dialog
            $ionicPopup.alert({
                title: 'Password Reset',
                template: 'We sent u an email with the new password'
            });
            $ionicLoading.hide();
            $scope.closeRecoveryPasswordModal();
        }).catch(function(error) {
            console.log("Error: " + error);
            $ionicPopup.confirm({
                title: 'Cant recover',
                content: error
            });
            $ionicLoading.hide();
        });
    };
    $scope.resetNewPassword = function(newPass) {
        console.log(newPass);
        return newPass;
    }
    $scope.login = function(user) {
$ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>Loading...</span>',
    });        $scope.authData = null;
        $scope.error = null;
        Auth.$authWithPassword({
            email: user.email,
            password: user.password
        }).then(function(data) {
            console.log("logged with: " + data)
            Users.get(data.auth.uid).$loaded().then(function(data) {
                console.log(data);
                var user = {
                    uid: data.$id,
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    afiliation: data.afiliation,
                    payment: data.payment,
                    location: data.location
                }
                if (data.conferences) {
                    user.conferences = data.conferences;
                }
                console.log(user);
                $localStorage.setObject('userProfile', user);
                $scope.selectModal.hide();
                $ionicLoading.hide();
                $state.go('home');
            });

        }).catch(function(error) {
            console.log("Error login the user,  " + error);
            $ionicPopup.confirm({
                title: 'No login',
                content: error
            });
            $ionicLoading.hide();
        });
    };
    $scope.createUser = function() {
        $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>Loading...</span>',
    });
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
                registerFlag: false
            },
            my_conferences: {},
            diploma: false
        }

        Auth.$createUser(newUser).then(function(userData) {
            console.log("User created with uid: " + userData.uid);
            Users.ref().child(userData.uid).set(newUser);
            console.log("User data stored: " + Users.get(userData.uid));
            $ionicLoading.hide();
            $scope.login(newUser);
        }).catch(function(error) {
            console.log("Error creating the user, " + error);
            $ionicPopup.confirm({
                title: 'Cant Register',
                content: error
            });
            $ionicLoading.hide();
        });
    };
    $scope.closeLogin = function() {
        $state.go('home');
    }


 /*FILTER BAR SECTION*/
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
    $scope.closeFilterBar = function() {
        if (filterBarInstance) {
            filterBarInstance();
            filterBarInstance = null;
        }
    };



    /*MODAL SETTING UP SECTION*/
    $ionicModal.fromTemplateUrl('templates/modals/signupModal.html', {
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



    $ionicModal.fromTemplateUrl('templates/modals/countriesModal.html', {
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
        $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>Loading...</span>',
    });
        Countries.all().$loaded().then(function(data) {
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



    $ionicModal.fromTemplateUrl('templates/modals/statesModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.selectStateModal = modal;
    });
    $scope.closeStateModal = function() {
        $scope.selectStateModal.hide();
    };
    $scope.openStateModal = function() {
        $ionicLoading.show({
        template: ' <ion-spinner icon="lines" class="spinner-light"></ion-spinner><br /><span>Loading...</span>',
    });
        Countries.mx().$loaded().then(function(data) {
            $scope.states = data;
            $ionicLoading.hide();
            $scope.selectStateModal.show();
        });
    };
    $scope.stateSelected = function(state) {
        $scope.user.state = state.nombre;
        $scope.closeStateModal();
    }


    $ionicModal.fromTemplateUrl('templates/modals/recoveryPasswordModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.recoveryPasswordModal = modal;
    });
    $scope.openRecoveryPasswordModal = function() {
        $scope.recoveryPasswordModal.show();
    }
    $scope.closeRecoveryPasswordModal = function() {
        $scope.recoveryPasswordModal.hide();
    }

    $ionicModal.fromTemplateUrl('templates/modals/resetPasswordModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.resetPasswordModal = modal;
    });
    $scope.openResetPasswordModal = function() {
        $scope.resetPasswordModal.show();
    }
    $scope.closeResetPasswordModal = function() {
        $scope.resetPasswordModal.hide();
    }

}
LoginCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$ionicSlideBoxDelegate", "$ionicPopup", "Countries", "$ionicFilterBar", "References", "Auth", "Users", "$http"];
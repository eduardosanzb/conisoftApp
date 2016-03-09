angular.module('conisoft16.controllers')
    .controller('LoginCtrl', LoginCtrl);

function LoginCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $ionicSlideBoxDelegate, $ionicPopup, Countries) {


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

    if ($localStorage.getObject('user')) {
        $state.go('app.schedule');
    } else {
        if ($rootScope.thereIsInternetConnection) {
            //strategy step 1.1
            $scope.countries = Countries.all();
            $scope.mxStates = Countries.mx();
            $localStorage.set('countriesFlag', true);
            $localStorage.setObject('countries', $scope.countries);
            $localStorage.setObject('mxStates', $scope.mxStates);
            $scope.user = {};

        } else {
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device."
            })
                .then(function(result) {
                    if (!result) {
                        ionic.Platform.exitApp();
                    }
                });
        }
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
        if ($scope.selectModalSlider.currentIndex() == 0)
            $scope.selectModal.hide();
        else
            $scope.selectModalSlider.previous();
    };

    $scope.openModal = function() {
        $scope.selectModalSlider.slide(0);
        $scope.itemSelected = false;
        $scope.categoryList = [{
            id: 1,
            title: 'Category A'
        }, {
            id: 2,
            title: 'Category B'
        }, {
            id: 3,
            title: 'Category C'
        }];
        $scope.selectModal.show();
    };

    $scope.nextPage = function(user) {
        $ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
    };


    $scope.selectItem = function(item) {
        $scope.itemSelected = item;
    };

    $scope.submitSelection = function() {
        $scope.selectModal.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Hurray!',
            template: 'You selected: ' + $scope.itemSelected.title
        });
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
        $scope.selectCountryModal.show();
    };

    $scope.countrySelected = function(countryId) {
        console.log(countryId);
        $scope.user.country = $scope.countries[countryId].name.common;
        $scope.closeCountryModal();
    }









}
LoginCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "$ionicSlideBoxDelegate", "$ionicPopup", "Countries", "$ionicPopover"];
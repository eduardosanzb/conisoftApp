angular.module('conisoft16.controllers')
    .controller('AboutCtrl', AboutCtrl);

function AboutCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, NgMap, $ionicPopup) {
    NgMap.getMap().then(function(map) {
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
    });

    $scope.driveToUpaep = function() {
        launchnavigator.navigate([19.047918, -98.216632]);
    }
    $scope.wifiSettings = function() {
        cordova.plugins.clipboard.copy("wifi_password");
        $ionicPopup.confirm({
            title: 'Connecting to Wifi',
            template: 'The Password is in the clipboard, connect to wifi: UPAEP EVENTOS'
        }).then(function(res) {
            if (res) {
                if(ionic.Platform.isIOS())
                    cordova.plugins.settings.open()
                else
                    cordova.plugins.settings.openSetting("wifi");
            } else {

            }
        })


    }
    $scope.twitter = function() {
        window.open('https://twitter.com/hashtag/conisoft2016', '_system', 'location=yes');
        return false;
    }
    $scope.developersInfo = function() {
        $scope.openDevelopersInfoModal();
    }





    //$ionicModal.fromTemplateUrl('',{}).then(function(modal){});
    $ionicModal.fromTemplateUrl('templates/modals/developersInfo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.developersInfoModal = modal;
    });
    $scope.openDevelopersInfoModal = function() {
        $ionicLoading.show();
        $scope.developersInfoModal.show();
        $ionicLoading.hide();
    }
    $scope.closeDevelopersInfoModal = function() {
        $scope.developersInfoModal.hide();
    }

}
AboutCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage", "NgMap","$ionicPopup"];
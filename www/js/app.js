// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'firebase', 'angularMoment', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])
.constant('FirebaseUrl', "https://upaepevent.firebaseio.com")
.run(function ($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
     if (window.StatusBar) {
          if (ionic.Platform.isAndroid()) {
              StatusBar.backgroundColorByHexString("#ecb100");
          } else {
              StatusBar.styleDefault();
          }
      }

    // To Resolve Bug
    ionic.Platform.fullScreen();

    //$rootScope.firebaseUrl = FirebaseUrl;
    $rootScope.displayName = null;

    Auth.$onAuth(function (authData) {
            if (authData) {
                console.log("Appjs Logged in as:", authData.uid);
                $rootScope.authData = authData;
                $rootScope.displayName = authData;
            } else {
                console.log("Appjs Logged out");
                $ionicLoading.hide();
                $location.path('/login');
            }
        });


    $rootScope.logout = function () {
        console.log("Logging out from the app");
        $ionicLoading.show({
          template: 'Logging Out...'
        });
        Auth.$unauth();
    }


    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, error){
      if( error === "AUTH_REQUIRED"){
        $location.path("/login");
      }
    });
  });
})
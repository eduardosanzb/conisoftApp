// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// 'firebase' will inject all the firebase and angularFire functions to our app
angular.module('conisoft16', ['ionic', 'conisoft16.controllers','firebase','conisoft16.services', 'pascalprecht.translate'])

.constant('FirebaseUrl', "https://conisoft16.firebaseio.com/")



.run(function($ionicPlatform, $localStorage, $rootScope, $ionicPopup, Auth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //Device language
    var locale = 'en';
    if(navigator.language){
      if(navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en"){
        locale = navigator.language.split('-')[0];
        //localStorage.set('locale', locale);
        $rootScope.locale = locale;

      }
    }

    //Device internet connection
    if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $rootScope.thereIsInternetConnection = false;
                } else {
                    $rootScope.thereIsInternetConnection = true;
                }
            }

    //Authenticaion stuff
    console.log(Auth.$getAuth());

  });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
  $stateProvider

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
 

    .state('app.schedule', {
      url: '/schedule',
      views: {
        'menuContent': {
          templateUrl: 'templates/schedule.html',
          controller: 'ScheduleCtrl',
          resolve:{}
        }
      }
    })
    
    .state('app.myschedule', {
      url: '/myschedule',
      views: {
        'menuContent': {
          templateUrl: 'templates/myschedule.html',
          controller: 'MyScheduleCtrl',
          resolve:{}
        }
      }
    })

    .state('app.speakers', {
      url: '/speakers',
      views: {
        'menuContent': {
          templateUrl: 'templates/speakers.html',
          controller: 'SpeakersCtrl',
          resolve:{}
        }
      }
    })

    .state('app.contact', {
      url: '/contact',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html',
          controller: 'ContactCtrl',
          resolve:{}
        }
      }
    })

    .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'RegisterCtrl',
          resolve:{}
        }
      }
    })

    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl',
          resolve:{}
        }
      }
    })

    .state('app.recomendations', {
      url: '/recomendations',
      views: {
        'menuContent': {
          templateUrl: 'templates/recomendations.html',
          controller: 'RecomendationsCtrl',
          resolve:{}
        }
      }
    })

    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

$translateProvider.translations('en',{
  login:{
    example : "This is an example of the translations.",
    country_header : "Countries"
  },
  schedule:{
    month : "April",
    by_speaker :  "by"
  }
});

$translateProvider.translations('en',{
  login:{
    example : "This is an example of the translations.",
    country_header : "Paises"
  },
  schedule:{
    month : "Abril",
    by_speaker :  "Por"
  }
});

var locale = 'es';

if(navigator.language){
  if(navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en"){
    locale = navigator.language.split('-')[0];
  }
}

$translateProvider.preferredLanguage(locale);
$translateProvider.fallbackLanguage(locale);
$translateProvider.useSanitizeValueStrategy('');


});

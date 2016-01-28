angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      resolve: {
          // controller will not be loaded until $waitForAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["Auth",
              function (Auth) {
              // $waitForAuth returns a promise so the resolve waits for it to complete
                  return Auth.$waitForAuth();
      }] }
      
    })
        
      
    
      
    .state('menu', {
      url: '/side-menu21',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })
      
    
      
        
    .state('menu.speakers', {
      url: '/speakers',
      views: {
        'side-menu21': {
          templateUrl: 'templates/speakers.html',
          controller: 'SpeakersCtrl'
        }
      }
    })
        
      
    
      
        
    .state('menu.schedule', {
      url: '/schedule',
      views: {
        'side-menu21': {
          templateUrl: 'templates/schedule.html',
          controller: 'ScheduleCtrl'
        }
      }
    })
        
      
    
      
        
    .state('menu.mySchedule', {
      url: '/my_schedule',
      views: {
        'side-menu21': {
          templateUrl: 'templates/mySchedule.html',
          controller: 'MyScheduleCtrl'
        }
      }
    })
        
      
    
      
        
    .state('menu.about', {
      url: '/about',
      views: {
        'side-menu21': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl'
        }
      }
    })
        
     .state('menu.contact', {
      url: '/contact',
      views: {
        'side-menu21': {
          templateUrl: 'templates/contact.html',
          controller: 'ContactCtrl'
        }
      }
    }) 
    
      
        
    .state('detail', {
      url: '/detail_event',
      templateUrl: 'templates/detailEvent.html',
      controller: 'DetailCtrl'
    })
        
      
    
      
        
    .state('detail2', {
      url: '/detail_speaker',
      templateUrl: 'templates/detailSpeaker.html',
      controller: 'Detail2Ctrl'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
angular
    .module('conisoft16.services', [])
    .factory('$localStorage', $localStorage)
    .factory('Conferences', Conferences)
    .factory('References', References)
    .factory('Speakers', Speakers)
    .factory('Countries',Countries)
    .factory('Users', Users)
    .factory('Reviews', Reviews)
    ;



function $localStorage($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}
$localStorage.$inject = ['$window'];

function Conferences(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope) {
    var locale = 'en';
    if (navigator.language) {
        if (navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en") {
            locale = navigator.language.split('-')[0];
        }
    }
    var ref = new Firebase(FirebaseUrl + "conferences/" + locale);
    var rootRef = new Firebase(FirebaseUrl);

    return {
        ref: function() {
            return ref;
        },
        get: function(conferenceId) {
            return $firebaseObject(ref.child(conferenceId));
        },
        all: function() {
            return $firebaseArray(ref.orderByChild("order"));
        },
        allObject: function() {
            return $firebaseObject(ref);
        },
        getSpeakers: function(conferenceId){
          return $firebaseArray(rootRef.child("speakers/" + locale).orderByChild( "conferences/"+ conferenceId).equalTo(true));
        }
    }
}
Conferences.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];






function References(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope) {
    var locale = 'en';
    if (navigator.language) {
        if (navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en") {
            locale = navigator.language.split('-')[0];
        }
    }
    var ref = new Firebase(FirebaseUrl + "references/" + locale);
}
References.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];



function Speakers(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope) {
    var locale = 'en';
    if (navigator.language) {
        if (navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en") {
            locale = navigator.language.split('-')[0];
        }
    }
    var ref = new Firebase(FirebaseUrl + "speakers/" + locale);
    return {
        ref: function() {
            return ref;
        },
        get: function(speakerId) {
            return $firebaseObject(ref.child(conferenceId));
        },
        all: function() {
            return $firebaseArray(ref.orderByChild("order"));
        },
        allObject: function() {
            return $firebaseObject(ref);
        }
    }
}
Speakers.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];


function Users(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope) {}
Users.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];

function Reviews(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope){}
Reviews.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];

function Countries(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope){

}
Countries.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];
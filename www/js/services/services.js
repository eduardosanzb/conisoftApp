angular
    .module('conisoft16.services', [])
    .factory('$localStorage', $localStorage)
    .factory('Conferences', Conferences)
    .factory('References', References)
    .factory('Speakers', Speakers)
    .factory('Countries', Countries)
    .factory('Users', Users)
    .factory('Reviews', Reviews)
    .factory('Auth', Auth)
    .factory('UnAuth', UnAuth)
    .factory('Hours',Hours)
    ;

function Hours(){
    return {
        0:08,
        1:09,
        2:10,
        3:11,
        4:12,
        5:13,
        6:14,
        7:15,
        8:16,
        9:17
    }
}
Hours.$inject = [];
function Auth(FirebaseUrl, $firebaseAuth) {
    var ref = new Firebase(FirebaseUrl);
    return $firebaseAuth(ref);
}
Auth.$inject = ['FirebaseUrl', '$firebaseAuth'];

function UnAuth(FirebaseUrl, $firebaseAuth) {
    var ref = new Firebase(FirebaseUrl);
    return ref;
}
UnAuth.$inject = ['FirebaseUrl', '$firebaseAuth'];


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
        getSpeakers: function(conferenceId) {
            return $firebaseArray(rootRef.child("speakers/" + locale).orderByChild("conferences/" + conferenceId).equalTo(true));
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
    return {
        ref: function() {
            return ref;
        },
        get: function(referenceId) {
            return $firebaseObject(ref.child(referenceId));
        },
        all: function() {
            return $firebaseArray(ref.orderByChild("Name"));
        },
        allObject: function() {
            return $firebaseObject(ref);
        }
    }
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


function Users(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope) {
    var ref = new Firebase(FirebaseUrl + "/users");
    var rootRef = new Firebase(FirebaseUrl);
    var locale = 'en';
        if (navigator.language) {
            if (navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en") {
                locale = navigator.language.split('-')[0];
            }
        }
    return {
        ref: function() {
            return ref;
        },
        get: function(userId) {
            return $firebaseObject(ref.child(userId));
        },
        getMySchedule: function(userId) {
            return $firebaseArray( rootRef.child("conferences/" + locale).orderByChild("users/" + userId).equalTo(true) );
        }
    }
}
Users.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];

function Reviews(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope) {}
Reviews.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];

function Countries(FirebaseUrl, $firebaseArray, $firebaseObject, $rootScope) {
    var ref = new Firebase(FirebaseUrl + "countries/");
    return {
        mx: function() {
            return $firebaseArray(ref.child("mx").orderByChild("NOMBRE"));
        },
        all: function() {
            return $firebaseArray(ref.child('others').orderByChild('name/common'));
        }
    }
}
Countries.$inject = ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$rootScope'];
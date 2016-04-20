angular.module('conisoft16.controllers')
    .controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ["$location", "$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "UnAuth", "$localStorage", "$ionicSideMenuDelegate", "Users", "Conferences", "$ionicViewSwitcher", "$location"];

function AppCtrl($location, $rootScope, $scope, $state, $ionicModal, $ionicLoading, UnAuth, $localStorage, $ionicSideMenuDelegate, Users, Conferences, $ionicViewSwitcher, $location) {
    /*  Template:   menu.html
     *  $state:     app
     *
     *  FUNCTIONS IN THIS CONTROLLER
     *   - logout()
     */

    $scope.currentPlatform = ionic.Platform.platform();
    // console.log($scope.currentPlatform);

    $scope.isItemActive = function(item) {
        return $location.path().indexOf(item) > -1;
    };

    $scope.logout = function() {
        /*  STRATEGY:
         *  1. Destroy the authorization object of firebase
         *  2. Clear the $locaStorage object of the userProfile
         *  3. Redirect the app to the login state
         */
        console.log("Good bye");
        UnAuth.unauth();
        $localStorage.setObject('userProfile', null);
        $state.go('login');
    }

    $scope.goToDetailEvent = function(eventId) {
        /*  Strategy:
         *  1. Set the direction of the navigation
         *  4. go to it, if is detail use a prevstate and an id
         */
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('detailEvent', {
            id: eventId,
            prevState: 'app.schedule'
        })
    }


    /*THIS FLAG IS TO SELECT IF LOGIN OR LOGOUT WILL BE DISPLAYED IN THE LEFT MENU*/
    if ($localStorage.getObject('userProfile') != null)
        $scope.flag = true;
    else
        $scope.flag = false;


    $scope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;

    /*  Strategy:
     *  1. If the userProfile exist, then we will retrieve all his favorite events
     *  2. When the events are loaded we will bind the speakers and the event
     *  3. bind data with the view
     */
    if ($localStorage.getObject('userProfile')) {
        Users.getMySchedule($localStorage.getObject('userProfile').uid)
            .$loaded()
            .then(function(mySchedule) {
                mySchedule.forEach(function(item) {
                    item.speakers = Conferences.getSpeakers(item.$id);

                });
                $scope.conferences = mySchedule;
                console.log(mySchedule);
            }).catch(function(error) {
                console.log(error);
            });
    }

    var userId = $localStorage.getObject('userProfile').uid;
            Users.get(userId).$loaded().then(function(data) {
                $scope.user = data;
                console.log('userdata: ' + $scope.user )
            });

    $scope.removeFromAgenda = function(eventId) {
            
        
        console.log(eventId)
        $scope.user.mySchedule[eventId] = !$scope.user.mySchedule[eventId];
        Conferences.get(eventId).$loaded().then(function(event) {
            event.users[$scope.user.$id] = null;
            event.$save();
        })
        $scope.user.$save().then(function(data) {
            console.log("Conference Deleted from my agenda" + data);
        }, function(error) {
            console.log("Error deleting event from agenda: " + error);
        });
    }

}

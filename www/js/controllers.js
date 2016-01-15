angular.module('app.controllers', [])
  
.controller('LoginCtrl', function (FirebaseUrl, $scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope, Auth) {
  console.log("Login Controller initialized");

  var ref = new Firebase(FirebaseUrl);
  var auth = $firebaseAuth(ref);
  $scope.user = null;
  $scope.form = null;

  //Modal creator for the signup template
  $ionicModal.fromTemplateUrl('templates/signup.html',{scope: $scope}).then(function (modal){$scope.modal = modal});
  $scope.openModal = function(){$scope.modal.show();};
  $scope.closeModal = function(){$scope.modal.hide();};

  //With this one we are going to auth with social
   $scope.login = function(authMethod) {


    $scope.login = function(authMethod) {
      $ionicLoading.show({template: 'Signing Up...'});
    Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
      console.log(authData)
      var user = {
          provider: authData.provider,
          name: getName(authData),
          image: getImage(authData)
        }
        console.log($rootScope.authData);
        ref.child("users").child(authData.uid).set(user);
        $ionicLoading.hide();
        $state.go('menu.schedule');
    }).catch(function(error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
          console.log(authData)
          var user = {
          provider: authData.provider,
          name: getName(authData),
          image: getImage(authData)
        }
        console.log($rootScope.displayName);
        ref.child("users").child(authData.uid).set(user);
        $ionicLoading.hide();
        $state.go('menu.schedule');
        });
      } else {
        console.log(error);
      }
    });
  };

  };

  

  // find a suitable name based on the meta info given by each provider
    function getName(authData) {
      switch(authData.provider) {
         case 'password':
           return authData.password.email.replace(/@.*/, '');
         case 'twitter':
           return authData.twitter.displayName;
         case 'facebook':
           return authData.facebook.displayName;
         case 'github':
            return authData.github.displayName;
         case 'google':
            return authData.google.displayName;
      }
    }

  // find a suitable name based on the meta info given by each provider
    function getImage(authData) {
      switch(authData.provider) {
         
         case 'twitter':
           return authData.twitter.profileImageURL;
         case 'facebook':
           return authData.facebook.profileImageURL;
         case 'github':
            return authData.github.profileImageURL;
         case 'google':
            return authData.google.profileImageURL;
      }
    }



  $scope.createUser = function (user){
    console.log("Create User function called");
    if(user && user.name && user.email && user.password){
      $ionicLoading.show({template: 'Signing Up...'});

      auth.$createUser({
        name: user.name,
        email: user.email,
        password: user.password
      }).then(function (userData) {
        //alert("User Created Succesfully");
        ref.child("users").child(userData.uid).set({
          email: user.email,
          name: user.name
        });
        $ionicLoading.hide();
        $scope.modal.hide();
        var userToSigIn = {
          email: user.email,
          pwdForLogin: user.password
        }
        $scope.signIn(userToSigIn);
      }).catch(function (error) {
          alert("Error: " + error);
          $ionicLoading.hide();
      });
    } else 
        alert("Please fill all details");
  }

  $scope.signIn = function(user){

    if (user && user.email && user.pwdForLogin) {
      $ionicLoading.show({template: 'Signing Up...'});
      auth.$authWithPassword({
        email: user.email,
        password: user.pwdForLogin
      }).then(function (authData) {
          console.log("Logged in as: " + authData.uid);
          ref.child("users").child(authData.uid).once('value', function (snapshot) {
                var val = snapshot.val();
                // To Update AngularJS $scope either use $apply or $timeout
                $scope.$apply(function () {
                    console.log("Apply: " + val);
                    $rootScope.displayName = val;
                });
            });
          $ionicLoading.hide();
          $state.go('menu.schedule');
          console.log($rootScope.displayName);
      }).catch(function (error) {
          alert("Authentication error: " + error.message);
          $ionicLoading.hide();
      });
    } else
        alert("Please enter email and password both");
   
  }

})



      
.controller('SpeakersCtrl', function($scope) {
  console.log("Speakers Controller initialized");
})
   
.controller('ScheduleCtrl', function($scope, $rootScope) {
  console.log("Schedule Controller initialized");
  console.log($rootScope.displayName);
  
})
   
.controller('MyScheduleCtrl', function($scope) {
  console.log("My Schedule Controller initialized");
})
   
.controller('AboutCtrl', function($scope) {
  console.log("About Controller initialized");

})
   
.controller('DetailCtrl', function($scope) {
  console.log("Detail Controller initialized");

})
   
.controller('Detail2Ctrl', function($scope) {

})
.controller('ContactCtrl', function($scope) {

})
 
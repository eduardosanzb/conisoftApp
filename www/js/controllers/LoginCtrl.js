angular.module('conisoft16.controllers')
.controller('LoginCtrl', LoginCtrl);

function LoginCtrl($rootScope, $scope, $state, $ionicModal, $ionicLoading, $localStorage, $ionicSlideBoxDelegate, $ionicPopup, Countries){

  $scope.closeLogin = function(){
    $state.go('app.schedule')
  }

  // $ionicModal.fromTemplateUrl('templates/signup.html',{scope:$scope})
  //   .then(function(modal){$scope.modal = modal});

  // $scope.openModal = function(){
  //   $scope.modal.show();
  // }
  // $scope.closeModal = function(){
  //   $scope.modal.hide();
  // }

   $ionicModal.fromTemplateUrl('templates/signup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectModal = modal;
            $scope.selectModalSlider = $ionicSlideBoxDelegate.$getByHandle('modalSlider');
            $scope.selectModalSlider.enableSlide(false);
        });
  

  $scope.closeModal = function () {
      if ($scope.selectModalSlider.currentIndex() == 0)
        $scope.selectModal.hide();
      else
        $scope.selectModalSlider.previous();
    };
  
    $scope.openModal = function () {
      $scope.selectModalSlider.slide(0);
      $scope.itemSelected = false;  
      $scope.categoryList = [
        {id: 1, title: 'Category A'},
        {id: 2, title: 'Category B'},
        {id: 3, title: 'Category C'}
      ];
      $scope.selectModal.show();
    };

    $scope.nextPage = function(user){
      $ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
    };
   

    $scope.selectItem = function(item) {
      $scope.itemSelected = item;
    };

    $scope.submitSelection = function() {
      $scope.selectModal.hide();
      var alertPopup = $ionicPopup.alert({
       title: 'Hurray!',
       template: 'You selected: '+$scope.itemSelected.title
     });
    };


    $scope.mx = Countries.mx();
  console.log($scope.mx);

}
LoginCtrl.$inject = ["$rootScope", "$scope", "$state", "$ionicModal", "$ionicLoading", "$localStorage","$ionicSlideBoxDelegate", "$ionicPopup", "Countries"];



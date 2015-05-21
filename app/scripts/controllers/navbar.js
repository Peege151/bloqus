'use strict';
angular.module('bloqusApp')
.controller("NavCtrl", function ($scope, $rootScope, $state, ngDialog){
    $scope.$watch(function(){
        if($state.current.name == 'main'){
            $scope.hideNav = true;
        } else {
            $scope.hideNav = false;
        }
    });

        $scope.showRules = function () {
            ngDialog.open({
                template: 'views/modals/rules-modal.html',
                controller: 'NavCtrl'
            })
        }
});
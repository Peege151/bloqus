'use strict'
angular.module('bloqusApp')
.controller("NavCtrl", function ($scope, $rootScope, $state){
    $scope.$watch(function(){
        if($state.current.name == 'main'){
            $scope.hideNav = true;
        } else {
            $scope.hideNav = false;
        }
    })
});
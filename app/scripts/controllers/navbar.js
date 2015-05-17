'use strict'
angular.module('bloqusApp')
.controller("NavCtrl", function ($scope, $rootScope, $state){
    console.log($state)
	console.log($state.current.name)

    $scope.$watch(function(){
        if($state.current.name == 'main'){
            $scope.hideNav = true;
            console.log($scope.hideNav)
        } else {
            $scope.hideNav = false
        }
    })
})            
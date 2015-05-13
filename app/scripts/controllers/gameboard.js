'use strict';

angular.module('bloqusApp')
    .controller('GameCtrl', function ($scope, $stateParams, GameFactory){
        $scope.game = $stateParams.game;
        console.log($scope.game)
    });
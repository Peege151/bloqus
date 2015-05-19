'use strict';

angular.module('bloqusApp')

    .controller("GameOverCtrl", function ($scope, $state, SignInFactory, $firebaseObject, $stateParams, ScoreFactory) {
            var board = $stateParams.game.board;
            $scope.scoreObj = ScoreFactory(board);
    });


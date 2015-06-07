'use strict';

angular.module('bloqusApp')

    .controller("GameOverCtrl", function ($scope, $state, SignInFactory, $firebaseObject, $stateParams, ScoreFactory, localStorageService, $http) {

        var board = $stateParams.game.board;
        $scope.scoreObj = ScoreFactory(board);

        var color = localStorageService.get('color');
        var makeUpper = function (str) {
            var newStr = str[0].toUpperCase();
            for (var i=1; i<str.length; i++){
                newStr += str[i];
            }
            return newStr;
        };
        var upperColor = makeUpper(color);

        var scoreStats = {
            email: localStorageService.get('email'),
            gameId: localStorageService.get('gameId'),
            color: color,
            score: $scope.scoreObj[upperColor].score,
            wins: true,
            losses: false
        };

        $http.post('/api/stats', scoreStats).then( function(data){
            console.log('Game stats saved.', data)
        });

        localStorageService.remove('id');
        localStorageService.remove('color');
        localStorageService.remove('host');
        localStorageService.remove('gameId');
        localStorageService.remove('fbGameId');
        localStorageService.remove('playerName');
        localStorageService.remove('name');
        localStorageService.remove('wm');

        //function removeItems('id', 'color', 'host', 'gameId') {
        //    return localStorageService.remove('id', 'color', 'host', 'gameId');
        //}

    });


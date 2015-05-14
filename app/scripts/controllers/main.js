'use strict';

angular.module('bloqusApp')

    .controller("MainCtrl", function ($scope, $state, SignInFactory, $firebaseObject) {
        var firebase = $firebaseObject(new Firebase("https://bloqus.firebaseio.com/")),
            shareId, currentGameId;

        firebase.$bindTo($scope, "firebase");

        firebase.$loaded().then(function () {

            $scope.createGame = function () {
                var randomId = Math.round(Math.random() * 100000000);
                var gameId = Math.round(Math.random() * 100000);
                var hostname = $scope.hostname;

                $scope.firebase = SignInFactory.createGame(randomId, gameId, hostname);

                $('.modal-backdrop').remove();
                $state.go('lobby', {currentId: randomId, shareId: gameId});

            };

            $scope.enterGame = function (playername) {

                $scope.firebase = SignInFactory.enterGame(playername, currentGameId, shareId);

                $('.modal-backdrop').remove();
                $state.go('lobby', {currentId: currentGameId, shareId: shareId});

                /*TODO: THROW ERROR IF GAME IS FULL*/
                //$scope.gameIsFull = true;
                //$('#join-game-modal').modal('hide');

            };

            $scope.checkGameId = function (gamenum) {
                var gameInfo = SignInFactory.checkGameId(gamenum);

                if (!gameInfo) {
                    $scope.gameDoesNotExist = true;
                    $('#join-game-modal').modal('hide');
                } else {
                    shareId = gameInfo.shareId;
                    currentGameId = gameInfo.currentGameId;
                    $scope.foundGame = gameInfo.foundGame;
                }
            }
        });
    });
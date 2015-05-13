'use strict';

angular.module('bloqusApp')

    .controller("MainCtrl", function ($scope, $state, FirebaseFactory, $firebaseObject) {
        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            firebase = $firebaseObject(ref),
            shareId, currentGameId;

        firebase.$bindTo($scope, "firebase");

        firebase.$loaded().then(function () {

            $scope.createGame = function () {
                var randomId = Math.round(Math.random() * 100000000);
                var gameId = Math.round(Math.random() * 100000);
                var hostname = $scope.hostname;

                $scope.firebase = FirebaseFactory.createGame(randomId, gameId, hostname);

                $('.modal-backdrop').remove();
                $state.go('lobby', {currentId: randomId, shareId: gameId});

            };

            $scope.enterGame = function (playername) {

                $scope.firebase = FirebaseFactory.enterGame(playername, currentGameId, shareId);

                $('.modal-backdrop').remove();
                $state.go('lobby', {currentId: currentGameId, shareId: shareId});

                /*TODO: THROW ERROR IF GAME IS FULL*/
                //$scope.gameIsFull = true;
                //$('#join-game-modal').modal('hide');

            };

            $scope.joinGame = function (gamenum) {
                var gameInfo = FirebaseFactory.joinGame(gamenum);

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
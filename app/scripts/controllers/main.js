'use strict';

angular.module('bloqusApp')

    .controller("MainCtrl", function ($scope, $state, SignInFactory, $firebaseObject, ngDialog) {
        var firebase = $firebaseObject(new Firebase("https://bloqus.firebaseio.com/")),
            shareId, currentGameId;

        $scope.private = false;

        $scope.createGameModal = function (){
            ngDialog.open({
                template: 'views/modal.html',
                controller: 'MainCtrl'
            })
        };


        $scope.joinGameModal = function (){
            ngDialog.open({
                template: 'views/join-game-modal.html',
                controller: 'MainCtrl'
            })
        };

        firebase.$bindTo($scope, "firebase");

        firebase.$loaded().then(function () {

            $scope.createGame = function () {
                var randomId = Math.round(Math.random() * 100000000);
                var gameId = Math.round(Math.random() * 100000);
                var hostname = $scope.hostname;
                $scope.firebase = SignInFactory.createGame(randomId, gameId, hostname, $scope.private);
                $scope.firebase.$save();
                $('.modal-backdrop').remove();
                ngDialog.closeAll();
                $state.go('lobby', {currentId: randomId, shareId: gameId});

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
            };

            $scope.enterGame = function (playername) {

                $scope.firebase = SignInFactory.enterGame(playername, currentGameId, shareId);

                $('.modal-backdrop').remove();
                ngDialog.closeAll();
                $state.go('lobby', {currentId: currentGameId, shareId: shareId});

                /*TODO: THROW ERROR IF GAME IS FULL*/
                //$scope.gameIsFull = true;
                //$('#join-game-modal').modal('hide');

            };

            $scope.findPublicGame = function(){
                var gameInfo = SignInFactory.findPublicGame();
                if (!gameInfo) {
                    //TO DO For Error Handling
                    $scope.publicDoesNotExist = true;
                    $('#join-game-modal').modal('hide');
                } else {
                    shareId = gameInfo.shareId;
                    currentGameId = gameInfo.currentGameId;
                    $scope.foundGame = gameInfo.foundGame;
                }
            }

        });
    });
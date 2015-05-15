'use strict';

angular.module('bloqusApp')
    .controller('LobbyCtrl', function ($scope, $state, $stateParams, $firebaseObject, localStorageService, LobbyFactory) {
        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            firebase = $firebaseObject(ref),
            name = localStorageService.get('name'),
            userId = localStorageService.get('id'),
            userColor = localStorageService.get('color')
        var currentId
        var currentGame;
        $scope.currentId = $stateParams.currentId;


        firebase.$bindTo($scope, "firebase");

        firebase.$loaded().then(function () {
           
            currentId = $stateParams.currentId;
            currentGame = $scope.firebase.games[currentId];
            var fbCurrentGame = $firebaseObject(new Firebase("https://bloqus.firebaseio.com/games/" + currentId));

            $scope.currentId = currentId;
            $scope.shareId = $stateParams.shareId;
            $scope.currentPlayers = currentGame.player;
            $scope.gridDimensions = fbCurrentGame.dimensions;
            $scope.polyNum = firebase.games[currentId].polyominoNum;
            $scope.numColors = firebase.games[currentId].numColors;
            $scope.isHost = localStorageService.get('host') == currentId;

            fbCurrentGame.$watch(function () {
 
            });

            $scope.switchToColor = function (newColor) {
                $scope.firebase = LobbyFactory.switchToColor(userColor, newColor, currentId);
                userColor = newColor;
            };

            $scope.setNumOfPlayers = function (val) {
                $scope.firebase = LobbyFactory.setNumOfPlayers(val, currentId);
            };

            $scope.setPolyomino = function (val) {
                $scope.polyNum = val;
                $scope.firebase = LobbyFactory.setPolyomino(val, currentId);
            };

            $scope.setDimensions = function (val) {
                $scope.gridDimensions = val;
                $scope.firebase = LobbyFactory.setDimensions(val, currentId);
            };

            $scope.startGame = function () {
                $scope.firebase.games[currentId].status = 'start';
                $state.go('gameboard', {game: { firebaseId: currentId, player: name }})
            };

            fbCurrentGame.$watch(function () {
                if (fbCurrentGame.status === 'start'){
                    $state.go('gameboard', {game: { firebaseId: currentId, player: name }});
                }
                $scope.currentPlayers = fbCurrentGame.player;
                $scope.numColors = fbCurrentGame.numColors;
                $scope.polyNum = fbCurrentGame.polyominoNum;
                $scope.gridDimensions = fbCurrentGame.dimensions;
            });

        });
    });
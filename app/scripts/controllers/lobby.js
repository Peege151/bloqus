'use strict';

angular.module('bloqusApp')
    .controller('LobbyCtrl', function ($rootScope, $scope, $state, $stateParams, $firebaseObject, localStorageService, LobbyFactory) {
        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            firebase = $firebaseObject(ref),
            name = localStorageService.get('name'),
            userId = localStorageService.get('id'),
            userColor = localStorageService.get('color'),
            userColor2, currentId;

        $scope.currentId = $stateParams.currentId;
        $scope.playerName = name;

        firebase.$bindTo($scope, "firebase");

        firebase.$loaded().then(function () {
           
            currentId = $stateParams.currentId;
            var fbCurrentGame = $firebaseObject(new Firebase("https://bloqus.firebaseio.com/games/" + currentId));
            $scope.currentId = currentId;
            $scope.shareId = $stateParams.shareId;
            $scope.currentPlayers = fbCurrentGame.player;
            $scope.gridDimensions = fbCurrentGame.dimensions;
            $scope.polyNum = fbCurrentGame.polyominoNum;
            $scope.numColors = fbCurrentGame.numColors;
            $scope.isHost = localStorageService.get('host') == currentId;

            $scope.switchToColor = function (newColor) {
                $scope.firebase = LobbyFactory.switchToColor(userColor, newColor, currentId);
                userColor = newColor;
            };

            $scope.takeOver = function (newColor) {
                $scope.firebase = LobbyFactory.takeOver(userColor, newColor, currentId);
            };

            $scope.dropControl = function (oldColor) {
                $scope.firebase = LobbyFactory.dropControl(oldColor, currentId);
                //userColor = newColor;
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
                if (fbCurrentGame.status === 'deleted'){
                    console.log("Host Left")
                    $state.go('main', {error: "Host Left, Game Aborted."})
                    .then(function(){
                        fbCurrentGame.$remove();
                    });
                }
                $scope.currentPlayers = fbCurrentGame.player;
                $scope.numColors = fbCurrentGame.numColors;
                $scope.polyNum = fbCurrentGame.polyominoNum;
                $scope.gridDimensions = fbCurrentGame.dimensions;
            });

            $rootScope.$on( '$stateChangeStart', function (event, toState, toParams, fromState) {
                if (toState.name !== 'gameboard' && fromState.name === 'lobby' && $scope.isHost){
                    //console.log("Host Left!")
                    fbCurrentGame.status = "deleted"
                }
                if (toState.name !== 'gameboard' && fromState.name === 'lobby'){
                    $scope.firebase = LobbyFactory.playerLeftLobby(userColor, currentId);
                }
            })

        });
    });
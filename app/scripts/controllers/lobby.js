'use strict';

angular.module('bloqusApp')
    .controller('LobbyCtrl', function ($rootScope, $scope, $state, $stateParams, $firebaseObject, localStorageService, LobbyFactory, AgentFactory) {
        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            firebase = $firebaseObject(ref),
            name = localStorageService.get('name'),
            userColor = localStorageService.get('color'),
            currentId;

        $scope.currentId = $stateParams.currentId;
        $scope.playerName = name;
        $scope.AiNames = AgentFactory.AgentNames();

        firebase.$bindTo($scope, "firebase");

        firebase.$loaded().then(function () {
           
            currentId = $stateParams.currentId;
            var fbCurrentGame = $firebaseObject(new Firebase("https://bloqus.firebaseio.com/games/" + currentId));
            $scope.shareId = $stateParams.shareId;
            $scope.isHost = localStorageService.get('host') == currentId;

            $scope.switchToColor = function (newColor) {
                LobbyFactory.switchToColor(userColor, newColor, currentId);
                userColor = newColor;
            };

            $scope.takeOver = function (newColor) {
                LobbyFactory.takeOver(userColor, newColor, currentId);
            };

            $scope.dropControl = function (oldColor) {
                LobbyFactory.dropControl(oldColor, currentId);
            };

            $scope.setNumOfPlayers = function (val) {
               LobbyFactory.setNumOfPlayers(val, currentId);
            };

            $scope.setPolyomino = function (val) {
                $scope.polyNum = val;
                LobbyFactory.setPolyomino(val, currentId);
            };

            $scope.setDimensions = function (val) {
                $scope.gridDimensions = val;
                LobbyFactory.setDimensions(val, currentId);
            };

            $scope.setTurnTime = function (val) {
                $scope.turnTime = val;
                LobbyFactory.setTurnTime(val, currentId);
            };

            $scope.setAiDifficulty = function (difficulty, color) {
                LobbyFactory.setAiDifficulty(difficulty, color, currentId);
            };

            $scope.startGame = function () {
                fbCurrentGame.status = 'start';
                fbCurrentGame.$save().then(function(){
                    $state.go('gameboard', {game: { firebaseId: currentId, player: name }})
                });
            };

            var watcher = fbCurrentGame.$watch(function () {

                if (fbCurrentGame.status === 'start'){
                    fbCurrentGame.$save().then(function(){
                        watcher();
                        $state.go('gameboard', {game: { firebaseId: currentId, player: name }});
                    });
                }
                if (fbCurrentGame.status === 'deleted'){
                    watcher();
                    $state.go('main', {error: "Host Left, Game Aborted."})
                }
                $scope.currentPlayers = fbCurrentGame.player;
                $scope.numColors = fbCurrentGame.numColors;
                $scope.polyNum = fbCurrentGame.polyominoNum;
                $scope.gridDimensions = fbCurrentGame.dimensions;
                $scope.turnTime = fbCurrentGame.turnTime;
            });

            $rootScope.$on( '$stateChangeStart', function (event, toState, toParams, fromState) {
                if (toState.name !== 'gameboard' && fromState.name === 'lobby' && $scope.isHost){
                    console.log("Host Left!");
                    fbCurrentGame.status = "deleted";
                    fbCurrentGame.$save().then( function (){
                        setTimeout(function (){
                            fbCurrentGame.$remove();
                        }, 2000);
                    });
                }
                if (toState.name !== 'gameboard' && fromState.name === 'lobby'){
                    $scope.firebase = LobbyFactory.playerLeftLobby(userColor, currentId);
                }
            })

        });
    });
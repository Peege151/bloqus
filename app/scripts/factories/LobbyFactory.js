'use strict';

angular.module('bloqusApp')

    .factory('LobbyFactory', function ($firebaseObject, localStorageService) {
        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            firebase = $firebaseObject(ref),
            computerPlayer = {
                name: 'Computer',
                id: 'compId',
                pieces: {has: 'somePieces'},
                hasPassed: false,
                isAI: true
            };

        return {

            switchToColor: function (oldColor, newColor, currentGame) {
                firebase.games[currentGame].player[newColor] = firebase.games[currentGame].player[oldColor];
                firebase.games[currentGame].player[oldColor] = computerPlayer;

                localStorageService.set('color', newColor);

                return firebase;
            },

            setNumOfPlayers: function (numOfPlayers, currentGame) {
                if (numOfPlayers === 2){
                    firebase.games[currentGame].player.red = null;
                    firebase.games[currentGame].player.yellow = null;
                } else {
                    firebase.games[currentGame].player.red = computerPlayer;
                    firebase.games[currentGame].player.yellow = computerPlayer;
                }
                return firebase;
            }
        }
    });

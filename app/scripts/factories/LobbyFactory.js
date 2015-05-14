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
                    firebase.games[currentGame].numColors = 2;
                } else {
                    firebase.games[currentGame].player.red = computerPlayer;
                    firebase.games[currentGame].player.yellow = computerPlayer;
                    firebase.games[currentGame].numColors = 4;
                }
                return firebase;
            },

            setPolyomino: function (polyNum, currentGame) {
                firebase.games[currentGame].polyominoNum = polyNum;
                //var polyOptions = {
                //   4: '1|2|3|4|5|6|7|8|9',
                //    5: '1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21',
                //    6: '1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21
                //};

                return firebase;

            }
        }
    });

'use strict';

angular.module('bloqusApp')

    .factory('LobbyFactory', function ($firebaseObject, localStorageService, SignInFactory) {
        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            firebase = $firebaseObject(ref),
            computerPlayer = {
                name: 'Computer',
                id: 'compId',
                pieces: '0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20',
                hasPassed: false,
                isAI: true
            };

        var LobbyFactory = {

            playerLeftLobby: function(color, currentGame){
                firebase.games[currentGame].player[color] = computerPlayer;
                return firebase.$save();
            },

            generatePolyominoString: function (val) {
                var polystring = "";
                for (var i = 0; i < val; i++) {
                    if (i === val - 1) return polystring += i;
                    polystring += i + "|"
                }
            },

            switchToColor: function (oldColor, newColor, currentGame) {
                firebase.games[currentGame].player[newColor] = firebase.games[currentGame].player[oldColor];
                firebase.games[currentGame].player[oldColor] = computerPlayer;

                localStorageService.set('color', newColor);

                return firebase;
            },

            setNumOfPlayers: function (numOfPlayers, currentGame) {
                if (numOfPlayers === 2) {
                    firebase.games[currentGame].player.yellow = null;
                    firebase.games[currentGame].player.green = null;
                    firebase.games[currentGame].numColors = 2;
                } else {
                    firebase.games[currentGame].player.yellow = computerPlayer;
                    firebase.games[currentGame].player.green = computerPlayer;
                    firebase.games[currentGame].numColors = 4;
                }
                return firebase;
            },

            setDimensions: function (val, currentGame) {
                firebase.games[currentGame].dimensions = val;
                firebase.games[currentGame].board = SignInFactory.boardBuilder(val);
                return firebase;
            },

            setPolyomino: function (polyNum, currentGame) {
                var polyOptions = {
                    4: LobbyFactory.generatePolyominoString(9),
                    5: LobbyFactory.generatePolyominoString(21),
                    6: LobbyFactory.generatePolyominoString(56)
                };

                firebase.games[currentGame].polyominoNum = polyNum;

                angular.forEach(firebase.games[currentGame].player, function (value, key) {
                    value.pieces = polyOptions[polyNum];
                });

                return firebase;

            }
        };

        return LobbyFactory;

    });

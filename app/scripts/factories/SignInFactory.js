'use strict';

angular.module('bloqusApp')

    .factory('SignInFactory', function ($firebaseObject, localStorageService) {

        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            firebase = $firebaseObject(ref),
            getCurrentPolyNum = function (currentId) {
                return firebase.games[currentId].polyominoNum
            };

        var generatePolyominoString = function (val) {
            var polystring = "";
            for (var i = 0; i < val; i++) {
                if (i === val - 1) return polystring += i;
                polystring += i + "|"
            }
        };

        var polyOptions = {
            4: generatePolyominoString(9),
            5: generatePolyominoString(21),
            6: generatePolyominoString(56)
        };

        var gameNotFull = function(id){
            var keepGoing = true;
            angular.forEach(firebase.games[id].player, function (value, key) {
                if(keepGoing){
                    if (value.isAI === true) {
                        keepGoing = false;
                    }
                };
                return false;
                });
            return true;
        };

        var compPlayer = {
                name: 'Easy AI',
                id: 'compId',
                pieces: '0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20',
                hasPassed: false,
                isAI: true
            };

        var SignInFactory = {

            boardBuilder: function (dimension) {
                var obj = {},
                    row = "",
                    key = "";

                for (var i = 0; i < dimension; i++) {
                    row += 'N';
                }

                for (var j = 0; j < dimension; j++) {
                    key = 'row' + j;
                    obj[key] = row;
                }
                return obj;
            },

            createGame: function (randomId, gameId, hostname, privateGame) {
                var hostId = Math.round(Math.random() * 100000000);
                //alert();
                if (!firebase.games) firebase.games = {};
                firebase.games[randomId] = {
                    id: gameId,
                    board: SignInFactory.boardBuilder(20),
                    status: 'lobby',
                    turnCounter: 0,
                    host: hostname,
                    privateGame: privateGame,
                    polyominoNum: 5,
                    dimensions: 20,
                    currentTurn: 'blue',
                    numColors: 4,
                    turnTime: 30,
                    player: {
                        blue: {
                            name: hostname,
                            id: hostId,
                            pieces: '0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20',
                            hasPassed: false,
                            isAI: false
                        },
                        yellow: compPlayer,
                        green: compPlayer,
                        red: compPlayer
                    }
                };

                if (!firebase.players) firebase.players = {};
                firebase.players[hostId] = {
                    game: gameId,
                    name: hostname
                };
                localStorageService.clearAll()
                localStorageService.set('name', hostname);
                localStorageService.set('id', hostId);
                localStorageService.set('color', 'blue');
                localStorageService.set('host', randomId);
                localStorageService.set('gameId', randomId);

                return firebase;
            },


            checkGameId: function (gamenum) {
                var obj;
                angular.forEach(firebase.games, function (value, key) {
                    if (value.id == gamenum) {
                        obj = {
                            shareId: value.id,
                            currentGameId: key,
                            foundGame: true
                        };
                    }
                });
                return obj;
            },

            findPublicGame: function(){
                var obj;
                angular.forEach(firebase.games, function (value, key) {
                    if (value.privateGame == false && value.status === 'lobby' && gameNotFull(key)) {
                        obj = {
                            shareId: value.id,
                            currentGameId: key,
                            foundGame: true
                        };
                    }
                });
                return obj;                
            },

            enterGame: function (playername, currentGameId, shareId) {
                var randomId = Math.round(Math.random() * 100000000);
                var currentPolyNum = getCurrentPolyNum(currentGameId);

                //check if a players schema exists, if not create one
                if (!firebase.players) firebase.players = {};

                var keepGoing = true;
                angular.forEach(firebase.games[currentGameId].player, function (playerObj, playerColor) {
                    if (keepGoing) {
                        if (playerObj.isAI) {
                            firebase.games[currentGameId].player[playerColor] = {
                                name: playername,
                                isAI: false,
                                id: randomId,
                                hasPassed: false,
                                pieces: polyOptions[currentPolyNum]
                            };

                            keepGoing = false;

                            //add the player to the database with the game id
                            firebase.players[randomId] = {
                                game: shareId,
                                name: playername
                            };
                            localStorageService.clearAll();
                            localStorageService.set('name', playername);
                            localStorageService.set('id', randomId);
                            localStorageService.set('color', playerColor);
                            localStorageService.set('gameId', currentGameId);

                        }
                    }
                });
                firebase.$save();
            },

            switchToColor: function (oldColor, newColor, currentGame) {
                firebase.games[currentGame].player[newColor] = firebase.games[currentGame].player[oldColor];
                firebase.games[currentGame].player[oldColor] = compPlayer;

                localStorageService.set('color', newColor);

                return firebase;
            }
        };

        return SignInFactory;

    });

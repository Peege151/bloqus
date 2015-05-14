'use strict';

angular.module('bloqusApp')

    .factory('FirebaseFactory', function ($firebaseObject, localStorageService) {
        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            firebase = $firebaseObject(ref);

        return {

            createGame: function (randomId, gameId, hostname) {
                var hostId = Math.round(Math.random() * 100000000);

                if (!firebase.games) firebase.games = {};
                firebase.games[randomId] = {
                    id: gameId,
                    status: 'lobby',
                    host: hostname,
                    polyominoNum: 5,
                    dimensions: 20,
                    currentTurn: 'blue',
                    numColors: 4,
                    player: {
                        blue: {
                            name: hostname,
                            id: hostId,
                            pieces: {has: 'somePieces'},
                            hasPassed: false,
                            isAI: false
                        },
                        yellow: {
                            name: 'Computer',
                            id: 'compId',
                            pieces: {has: 'somePieces'},
                            hasPassed: false,
                            isAI: true
                        },
                        green: {
                            name: 'Computer',
                            id: 'compId',
                            pieces: {has: 'somePieces'},
                            hasPassed: false,
                            isAI: true
                        },
                        red: {
                            name: 'Computer',
                            id: 'compId',
                            pieces: {has: 'somePieces'},
                            hasPassed: false,
                            isAI: true
                        }
                    }
                };

                if (!firebase.players) firebase.players = {};
                firebase.players[hostId] = {
                    game: gameId,
                    name: hostname
                };

                localStorageService.set('player', hostname);

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

            enterGame: function (playername, currentGameId, shareId) {
                var randomId = Math.round(Math.random() * 100000000);

                //check if a players schema exists, if not create one
                if (!firebase.players) firebase.players = {};

                var keepGoing = true;
                angular.forEach(firebase.games[currentGameId].player, function (playerObj, playerColor) {
                    if (keepGoing) {
                        if (playerObj.name == 'Computer') {
                            firebase.games[currentGameId].player[playerColor] = {
                                name: playername,
                                isAI: false,
                                id: randomId,
                                hasPassed: false,
                                pieces: {has: 'somePieces'}
                            };

                            keepGoing = false;

                            //add the player to the database with the game id
                            firebase.players[randomId] = {
                                game: shareId,
                                name: playername
                            };

                            localStorageService.set('player', playername);

                        }
                    }
                });
                return firebase;
            }
        }
    });

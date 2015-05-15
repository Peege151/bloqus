'use strict';

angular.module('bloqusApp')

    .factory('GameFactory', function ($rootScope, $firebaseObject, localStorageService, LogicFactory) {

        //Specific to this player.
    	var thisPlayer,        //name of the player
            thisColors,       //colors that the player currently has
            thisPiecesLeft;   //Pieces the player has left.  This is an object, the keys of which are the colors that 
                              //this particular player has in mind.

        //Common across everyone currently playing the game.
    	var universalPiecesArray,           //All the pieces legal in this current game.
            universalSequenceOfColors,      //All colors in game.
            universalCurrentTurn;           //Current colors turn.

        var gameFirebase
        var onLoadedEvents = [];


        return {

        	setGameFactory: function(fbGameId, playerName){
        		var self = this; 

                //console.log("GameID", fbGameId);
                //console.log("PlayerName", playerName);
                //What if we didn't get the information handed to us? Let's try to load it.
                //local storage works synchronously, which makes this pretty easy.
                //Currently, if we have neither fbGameId, nor support localStorage, we just fail ignominiously.
                var fbGameId = fbGameId || localStorageService.get('fbGameId')
                thisPlayer = playerName || localStorageService.get('playerName')

                //console.log("GameID", fbGameId);
                //console.log("PlayerName", thisPlayer);

        		gameFirebase = $firebaseObject(new Firebase("https://bloqus.firebaseio.com/games/"+fbGameId));

                //console.log(gameFirebase);

        		gameFirebase.$loaded().then(function(){
                    //Initialize stuff--basically, setting up stuff which is not loaded.
                    //Right now this is mostly just generating the pieces with PiecesGenerator.
                    self.initialize();
                    //Loop through events that happens when game is loaded.  Right now this isn't really used.
                    onLoadedEvents.forEach(function(evnt){
                        evnt(gameFirebase);
                    });
                    //And we have a state, so let's emit it.
                    self.emitState();

                    //save these things for later.
                    if (localStorageService.isSupported){
                        localStorageService.set('fbGameId', fbGameId);
                        localStorageService.set('playerName', thisPlayer);
                    }
                });

        	},

            onGameLoaded: function(func){
            	onLoadedEvents.push(func);
            },

            //right now, this is a bit misleadingly titled.  Whenever gameFirebase changes,
            //this both (1) emits a universal event and updates the state of gamefactory.
            emitState: function(){
                console.log("Change ocurred in database.");

                //Create stuff to be emitted from state.
                var tempBoard = this.createBoard(gameFirebase);
                var tempAllPieces = this.allPieces();

                //Changing the state.
                universalCurrentTurn = gameFirebase.currentTurn;
                thisPiecesLeft = Object.keys(tempAllPieces).reduce(function(old, cur){ old = (thisColors.indexOf(cur)) ? old[cur] = tempAllPieces[cur] : old; return old; }, {});

                //Emit the event indicating what has changed.
                $rootScope.$emit("stateChanged", tempBoard, tempAllPieces, thisColors, universalCurrentTurn);

            },

            createBoard: function(fbgame){

                var tempBoard = new LogicFactory.Board(fbgame.dimensions);
                console.log(fbgame.board)
                tempBoard.consumeFire(fbgame.board);
                tempBoard.currentTurn = fbgame.currentTurn;
                return tempBoard;
            },

            allPieces: function(){
                var playerPieces = {}
                for(var x = 0; x < universalSequenceOfColors.length; x++){
                    //debugger;
                    var m = gameFirebase;
                    var p = gameFirebase.player;
                    var o = gameFirebase.player[universalSequenceOfColors[x]];
                    var q = gameFirebase.player[universalSequenceOfColors[x]].pieces;
                    debugger;
                    playerPieces[universalSequenceOfColors[x]] = gameFirebase.player[universalSequenceOfColors[x]].pieces.split('|').map(function(num){
                        return universalPiecesArray[num];
                    });
                }
                return playerPieces;
            },


            initialize: function(){

                console.log("INIT START:")

                var self = this;

                //Stuff everyone has in common, which never changes.
                universalPiecesArray = LogicFactory.PiecesGenerator(gameFirebase.polyominoNum);
                universalSequenceOfColors = (gameFirebase.numColors == 4) ? ["blue", "yellow", "red","green"] : ["blue","red"];

                //Stuff only we got, which never changes.
                //thisPlayer -- already set.
                thisColors = universalSequenceOfColors.filter(function(c){ return gameFirebase.player[c].name == thisPlayer });


                //Set up events.


                //If anything changes in firebase, emit the state that we're currently in.
                gameFirebase.$watch(function(){
                    self.emitState();
                });

                //If we hear a move, try to make it.
                $rootScope.$on('makeMove', function(event, move){
                    console.log("'Move event' caught.");
                    //console.log(gameFirebase.currentTurn)
                    //console.log(thisColors);
                    if(thisColors.indexOf(gameFirebase.currentTurn) !== -1){
                        console.log("Legal move made.")

                        //Change board
                        var tempBoard = self.createBoard(gameFirebase);
                        var moveWorked = tempBoard.doMove(move);
                        if(moveWorked){
                            var newFireState = tempBoard.emitFire();
                            gameFirebase.board = newFireState;

                            //Change pieces saved
                            var arr = gameFirebase.player[gameFirebase.currentTurn].pieces.split('|')
                            for(var i = 0; i < gameFirebase.player[gameFirebase.currentTurn].pieces.split('|').length - 1; i++){
                                console.log("Len", gameFirebase.player[gameFirebase.currentTurn].pieces.split('|').length);
                                console.log("arr i", arr[i]);
                                console.log("universalPiecesArray", universalPiecesArray[arr[i]]);
                                if (universalPiecesArray[arr[i]].sameShapeAtAll(move.piece)){
                                    arr.splice(i,1);
                                }
                            }
                            gameFirebase.player[gameFirebase.currentTurn].pieces = arr.join("|");

                            //Advance whose turn it is.
                            var curIndex = universalSequenceOfColors.indexOf(gameFirebase.currentTurn);
                            curIndex++;
                            curIndex = (curIndex % universalSequenceOfColors.length)
                            gameFirebase.currentTurn = universalSequenceOfColors[curIndex];
                            
                            gameFirebase.$save();
                        }else{
                            //Do something because the move was illegal.
                        }
                    }

                });

                $rootScope.$on('passTurn', function(){
                    console.log("'Passing' event caught.");
                    //console.log(thisColors)
                    if(thisColors.indexOf(gameFirebase.currentTurn) !== -1){

                        //Alter current Turn object in fb.
                        //console.log(thisColors, gameFirebase.currentTurn);
                        var curIndex = universalSequenceOfColors.indexOf(thisColors);
                        curIndex++;
                        curIndex = (curIndex % universalSequenceOfColors.length)
                        gameFirebase.currentTurn = universalSequenceOfColors[curIndex];

                        //Mark player so it says that the player has passed.
                        gameFirebase.player[gameFirebase.currentTurn].hasPassed = true;

                        gameFirebase.$save();                    
                    }
                });

            }
        }
});	
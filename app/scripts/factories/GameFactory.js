'use strict';

angular.module('bloqusApp')

    .factory('GameFactory', function ($rootScope, $firebaseObject, localStorageService, LogicFactory, AgentFactory) {
        //sounds
        var snap = new Howl({urls: ['./sounds/piecesnap.mp3']});
        var passSound = new Howl({urls: ['./sounds/pass.mp3']});

        //Specific to this player, game information
    	var thisPlayer,        //name of the player
            thisColors,       //colors that the player currently has
            thisPiecesLeft;   //Pieces the player has left.  This is an object, the keys of which are the colors that 
                              //this particular player has in mind.

        var localTurnCounter;

        //Common across everyone currently playing the game, game information
    	var universalPiecesArray,           //All the pieces legal in this current game.
            universalSequenceOfColors,      //All colors in game.
            universalCurrentTurn;           //Current colors turn.

        //Oter stuff.
        var gameFirebase;

        return {

        	setGameFactory: function(fbGameId, playerName){
        		var self = this; 

                //Local storage works synchronously, which is really convenient.
                var fbGameId = fbGameId || localStorageService.get('fbGameId')
                thisPlayer = playerName || localStorageService.get('playerName')

        		gameFirebase = $firebaseObject(new Firebase("https://bloqus.firebaseio.com/games/"+fbGameId));

        		gameFirebase.$loaded().then(function(){
                    //Initialize stuff--basically, setting up stuff which is not loaded.
                    self.initialize();
                    //And we have a state, so let's emit it.
                    self.emitState();
                    //save these things for later.
                    if (localStorageService.isSupported){
                        localStorageService.set('fbGameId', fbGameId);
                        localStorageService.set('playerName', thisPlayer);
                    }
                });
        	},

            amHost: function(){
                return Object.keys(gameFirebase.player).some(function(color, index, arr){ return thisColors.indexOf(color) !== -1 && gameFirebase.player[color].name == gameFirebase.host })
            },

            isComputersTurn: function(){
                return gameFirebase.player[gameFirebase.currentTurn].isAI;
            },

            currentPlayer: function(){
                return gameFirebase.player[gameFirebase.currentTurn];
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

                //If it is the computer's turn, and the player right now is a computer, and if we are the host--well, let the computer take a turn.
                
                if( this.allPlayersHavePassed() ){
                    localTurnCounter = 0;
                    console.log("Everything ends.");
                    $rootScope.$emit('gameOver', tempBoard);
                    return;
                }else{ 

                    if( this.amHost() ){
                        console.log("Hey, I'm the host.")

                        if(gameFirebase.player[universalCurrentTurn].hasPassed){

                            //else{
                                console.log("It is the turn of ", universalCurrentTurn, ", who is passing.")
                                var curIndex = (universalSequenceOfColors.indexOf(gameFirebase.currentTurn) + 1) % universalSequenceOfColors.length;
                                gameFirebase.currentTurn = universalSequenceOfColors[curIndex];
                                gameFirebase.turnCounter++;
                                gameFirebase.$save();  //Save everything.
                            //}

                        }else{

                            if ( this.isComputersTurn() ){
                                console.log("It is the turn of computer ", universalCurrentTurn, " who has not yet passed.");
                                this.doComputerTurn();
                            }else{
                                console.log("It is a human's turn.");
                                //Do nothing, because we need to wait for them to take a turn.
                            }
                        }
                    }
                }
            },

            doComputerTurn: function(){
                //It's going to need all these
                console.log("Computer turn has started.");
                var curPlayer = this.currentPlayer();
                var computerName = curPlayer.name;
                var tempBoard = this.createBoard(gameFirebase);
                var tempAllPieces = this.allPieces();
                var tempComputerColors = Object.keys(gameFirebase.player).filter(function(color, index, arr){  return gameFirebase.player[color].name == curPlayer.name});
                var aiName = (AgentFactory.AgentNames().indexOf(curPlayer) == -1) ? 'Easy AI' : computerName;
                //debugger;

                var decision = AgentFactory.Agent(aiName)(tempBoard, tempAllPieces, tempComputerColors, universalCurrentTurn);
                if (decision.pass==false){
                    var moveWorked = tempBoard.doMove(decision.move);
                    if(moveWorked){
                        console.log("The computer moves.");
                        var newFireState = tempBoard.emitFire();
                        gameFirebase.board = newFireState;
                        gameFirebase.player[universalCurrentTurn].pieces = gameFirebase.player[universalCurrentTurn].pieces.split('|').filter(function(num, index, arr){
                            return !universalPiecesArray[num].sameShapeAtAll(decision.move.piece);
                        }).join('|');
                        var curIndex = (universalSequenceOfColors.indexOf(gameFirebase.currentTurn) + 1) % universalSequenceOfColors.length;
                        gameFirebase.currentTurn = universalSequenceOfColors[curIndex];
                        gameFirebase.turnCounter++;
                        gameFirebase.$save();  //Save everything. 
                    }
                }else{
                        console.log("The computer decides to pass for the first time.");
                        gameFirebase.player[gameFirebase.currentTurn].hasPassed = true;  //Mark player so it says that the player has passed.
                        var curIndex = (universalSequenceOfColors.indexOf(gameFirebase.currentTurn) + 1) % universalSequenceOfColors.length;
                        gameFirebase.currentTurn = universalSequenceOfColors[curIndex];
                        gameFirebase.turnCounter++;
                        gameFirebase.$save();  //Save everything. 
                } 

            },

            isPlayersTurn: function(){
                console.log(thisColors);
                console.log(gameFirebase.currentTurn);
                return ( thisColors.indexOf(gameFirebase.currentTurn) !== -1 )
            },

            allPlayersHavePassed: function(){
                var allPassed = true;
                angular.forEach(gameFirebase.player, function (value, key) {
                    if (value.hasPassed === false) allPassed = false;
                });
                return allPassed;
            },

            createBoard: function(fbgame){
                var tempBoard = new LogicFactory.Board(fbgame.dimensions);
                tempBoard.consumeFire(fbgame.board);
                tempBoard.currentTurn = fbgame.currentTurn;
                return tempBoard;
            },

            allPieces: function(){
                var playerPieces = {}
                for(var x = 0; x < universalSequenceOfColors.length; x++){
                    playerPieces[universalSequenceOfColors[x]] = gameFirebase.player[universalSequenceOfColors[x]].pieces.split('|').map(function(num){
                        return universalPiecesArray[num];
                    });
                }
                return playerPieces;
            },


            initialize: function(){

                var self = this;

                //Stuff everyone has in common, which never changes.
                universalPiecesArray = LogicFactory.PiecesGenerator(gameFirebase.polyominoNum);
                universalSequenceOfColors = (gameFirebase.numColors == 4) ? ["blue", "yellow", "red","green"] : ["blue","red"];

                //Stuff only we got, which never changes.
                //thisPlayer == something already set.
                thisColors = universalSequenceOfColors.filter(function(c){ return gameFirebase.player[c].name == thisPlayer });

                //Adding something to keep track of turns
                gameFirebase.status = 'playing'
                gameFirebase.turnCounter = gameFirebase.turnCounter || 0;
                localTurnCounter = localTurnCounter || 0;

                //If anything changes in firebase, emit the state that we're currently in.
                gameFirebase.$watch(function(){
                    console.log("WATCH:")
                    console.log("Local: ", localTurnCounter);
                    console.log("DB: ", gameFirebase.turnCounter);
                    if(localTurnCounter == gameFirebase.turnCounter - 1){
                        console.log("A turn for stuff.");
                        localTurnCounter++;
                        self.emitState();
                    }
                });

                var makeMove = function(event, move){
                    console.log("'Move' event caught.");
                    if(self.isPlayersTurn()){
                        //Change board
                        console.log("It's your turn.")
                        var tempBoard = self.createBoard(gameFirebase);
                        var moveWorked = tempBoard.doMove(move);
                        console.log("Move,", move);
                        if(moveWorked){
                            snap.play();
                            console.log("Move worked.")
                            
                            var newFireState = tempBoard.emitFire();
                            gameFirebase.board = newFireState;
                            gameFirebase.player[gameFirebase.currentTurn].pieces = gameFirebase.player[gameFirebase.currentTurn].pieces.split('|').filter(function(num, index, arr){
                                return !universalPiecesArray[num].sameShapeAtAll(move.piece);
                            }).join('|');
                            var curIndex = (universalSequenceOfColors.indexOf(gameFirebase.currentTurn) + 1) % universalSequenceOfColors.length;
                            console.log("Current index ", curIndex)
                            gameFirebase.currentTurn = universalSequenceOfColors[curIndex];
                            gameFirebase.turnCounter++;
                            gameFirebase.$save();  //Save everything.
                        }else{
                            //TODO: Do something else, because the move was illegal.  Or just do nothing, as it does nothing now.
                        }
                    }
                };

                var passTurn = function(){
                    passSound.play();
                    console.log("'Passing' event caught.");
                    if(self.isPlayersTurn()){
                        gameFirebase.player[gameFirebase.currentTurn].hasPassed = true;  //Mark player so it says that the player has passed.
                        var curIndex = (universalSequenceOfColors.indexOf(gameFirebase.currentTurn) + 1) % universalSequenceOfColors.length;
                        gameFirebase.currentTurn = universalSequenceOfColors[curIndex];
                        gameFirebase.turnCounter++;
                        gameFirebase.$save();  //Save everything.
                    }
                };

                $rootScope.$on('makeMove', makeMove);

                $rootScope.$on('passTurn', passTurn);



            }
        }
});	
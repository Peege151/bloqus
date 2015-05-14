'use strict';

angular.module('bloqusApp')

    .factory('GameFactory', function ($rootScope, $firebaseObject, localStorageService, LogicFactory) {

    	var thisPlayer,
            thisColor,
            firebaseId;

    	var gameRef, gameFirebase
    	var onLoadedEvents = [];


    	var defaultPiecesArray;
        var actualPiecesArray;
        var sequenceOfColors;


        return {

        	setGameFactory: function(firebaseId, player){
        		var self = this;
        		var gameId = gameId;
        		//So, if we are passed a gameId, then we should use that.
     			//This means that this is ocurring after direct state transfer from 
     			//another controller.
        		if(firebaseId){
        			firebaseId = firebaseId;
        			thisPlayer = player;
            		gameRef = new Firebase("https://bloqus.firebaseio.com/games/"+firebaseId)
            		gameFirebase = $firebaseObject(gameRef);
            		gameFirebase.$loaded().then(function(){
            			//Initialize, if intialization is needed, which it should be.
            			self.initialize();
            			//Iterate through events.
            			onLoadedEvents.forEach(function(evnt){
            				evnt(gameFirebase);
            			});
                        self.emitState();
            			//Same firebase id for later, in case of reload
        				if (localStorageService.isSupported){
        					localStorageService.set('firebaseId', firebaseId);
        					localStorageService.set('player', thisPlayer);
        				}
            		});

            	//On the other hand, if we don't have a gameId set, then
            	//that means that this might have come from some kind of accidental reload.
            	//In that case, then try to load it from an id stored in local storage.
        		}else{
        			firebaseId = localStorageService.get('firebaseId')
        			thisPlayer = localStorageService.get('player')
        			gameRef = new Firebase("https://bloqus.firebaseio.com/games/"+firebaseId)
            		gameFirebase = $firebaseObject(gameRef);
            		gameFirebase.$loaded().then(function(){
            			//Initialize, if initialization is needed.
            			self.initialize();
            			//Iterate through events
                        self.emitState();
            			onLoadedEvents.forEach(function(evnt){
            				evnt(gameFirebase);
            			});
            		});
        		}

        	},

            onGameLoaded: function(func){
            	onLoadedEvents.push(func);
            },


            emitState: function(){
                console.log("Change ocurred in database.");
                //Create fully-fledged board state.
                var tempBoard = new LogicFactory.Board(gameFirebase.dimensions);
                tempBoard.consumeFire(gameFirebase.board);
                tempBoard.currentTurn = gameFirebase.currentTurn;

                //Get pieces for each color that is currently playing.
                var playerPieces = {}
                var colors = Object.keys(gameFirebase.player);
                for(var x = 0; x < colors.length; x++){
                    playerPieces[colors[x]] = gameFirebase.player[colors[x]].pieces.split('|').map(function(num){
                        return defaultPiecesArray[num];
                    });
                }

                //Emit the event indicating what has changed.
                $rootScope.$emit("stateChanged", tempBoard, playerPieces, thisColor);

            },


            initialize: function(){
                var self = this;

                defaultPiecesArray = LogicFactory.PiecesGenerator(gameFirebase.polyominoNum);

                sequenceOfColors = (gameFirebase.numColors == 4) ? ['blue','yellow','green','red'] : ['blue', 'green'];

                var colors = Object.keys(gameFirebase.player);
                //console.log(thisPlayer)
                thisColor = colors.filter(function(c){ return gameFirebase.player[c].name == thisPlayer })[0];
                //console.log(thisColor);
                gameFirebase.$watch(function(){
                    self.emitState();
                });

                $rootScope.$on('makeMove', function(event, move){
                    console.log("'Move event' caught.");
                    if(thisColor === gameFirebase.currentTurn){


                        //Change board
                        var tempBoard = new LogicFactory.Board(gameFirebase.dimensions);
                        tempBoard.consumeFire(gameFirebase.board);
                        tempBoard.doMove(move);
                        var newFireState = tempBoard.emitFire();
                        gameFirebase.board =  newFireState;

                        //Change pieces saved
                        var arr = gameFirebase.player[thisColor].pieces.split('|')
                        for(i = 0; i < gameFirebase.player[thisColor].pieces.split('|').length; i++){
                            if (defaultPiecesArray[arr[i]].sameShapeAtAll(move.piece)){
                                arr.splice(i,1);
                            }
                        }
                        gameFirebase.player[thisColor].pieces = arr.join("|");

                        //Advance whose turn it is.
                        var curIndex = sequenceOfColors.indexOf(thisColor);
                        curIndex++;
                        curIndex = (curIndex % sequenceOfColors.length)
                        gameFirebase.currentTurn = sequenceOfColors[curIndex];
                        
                        gameFirebase.$save();
                    }

                });

                $rootScope.$on('passTurn', function(){
                    console.log("'Passing' event caught.");
                    //console.log(thisColor)
                    if(thisColor === gameFirebase.currentTurn){

                        //Alter current Turn object in fb.
                        //console.log(thisColor, gameFirebase.currentTurn);
                        var curIndex = sequenceOfColors.indexOf(thisColor);
                        curIndex++;
                        curIndex = (curIndex % sequenceOfColors.length)
                        gameFirebase.currentTurn = sequenceOfColors[curIndex];

                        //Mark player so it says that the player has passed.
                        gameFirebase.player[thisColor].hasPassed = true;

                        gameFirebase.$save();                    
                    }
                });

            }
        }
});	
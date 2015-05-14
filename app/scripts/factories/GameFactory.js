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
        			})
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
    			player = localStorageService.get('firebaseId')
    			gameRef = new Firebase("https://bloqus.firebaseio.com/games/"+firebaseId)
        		gameFirebase = $firebaseObject(gameRef);
        		gameFirebase.$loaded().then(function(){
        			//Initialize, if initialization is needed.
        			self.initialize();
        			//Iterate through events
        			onLoadedEvents.forEach(function(evnt){
        				evnt(gameFirebase);
        			})
        		});
    		}

    	},

        onGameLoaded: function(func){
        	onLoadedEvents.push(func);
        },



        initialize: function(){


            defaultPiecesArray = LogicFactory.PiecesGenerator(gameFirebase.polyominoNum);

            sequenceOfColors = (gameFirebase.numColors == 4) ? ['blue','yellow','green','red'] : ['blue', 'green'];

            thisColor = 'blue';//Object.keys(gameFirebase.player).filter(function(color){ return gameFirebase.player[color].name == thisPlayer })[0];
            //console.log(thisColor);
            gameFirebase.$watch(function(){
                alert("Something changed somewhere.");
            });



            if (thisColor == gameFirebase.currentTurn){
                //do something
            }else{
                //do something else.
            }

            $rootScope.$on('makeMove', function(event, move){
                if(thisColor === gameFirebase.currentTurn){
                    //logic that finds what piece the move is using
                    //get rid of that piece in gameFirebase, etc.
                    //place it on board.
                    //update board
                    //save all.

                    //Change board
                    var tempBoard = new LogicFactory.Board(gameFirebase.dimensions);
                    tempBoard.consumeFire(gameFirebase.board);
                    tempBoard.doMove(move);
                    var newFireState = tempBoard.emitFire();
                    gameFirebase.board =  newFireState;

                    //Change pieces saved
                    var arr = gameFirebase.player[thisColor].pieces.split('|')
                    for(i = 0; i < gameFirebase.player[thisColor].pieces.split('|').length; i++){
                        if (defaultPiecesArray[arr[i]]].sameShapeAtAll(move.piece)){
                            arr.splice(i,1);
                        }
                    }
                    gameFirebase.player[thisColor].pieces = arr.join("|");
                    
                    gameFirebase.$save();
                }

            });
            $rootScope.$on('passTurn', function(){
                if(thisColor === gameFirebase.currentTurn){
                    console.log(thisColor, gameFirebase.currentTurn);
                    var curIndex = sequenceOfColors.indexOf(thisColor);
                    curIndex++;
                    curIndex = (curIndex % sequenceOfColors.length)
                    gameFirebase.currentTurn = sequenceOfColors[curIndex];
                    gameFirebase.$save();                    
                }
            });

        }
    }
});	
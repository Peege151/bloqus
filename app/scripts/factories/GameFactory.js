'use strict';

angular.module('bloqusApp')

    .factory('GameFactory', function ($rootScope, $firebaseObject, localStorageService, LogicFactory) {

    	var player, firebaseId;

    	var gameRef, gameFirebase
    	var onLoadedEvents = [];

    	var playersPieces;
    	var boardAsArray

        return {

    	setGameFactory: function(firebaseId, player){
    		var self = this;
    		var gameId = gameId;
    		//So, if we are passed a gameId, then we should use that.
 			//This means that this is ocurring after direct state transfer from 
 			//another controller.
    		if(firebaseId){
    			firebaseId = firebaseId;
    			player = player;
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
    					localStorageService.set('player', player);
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
        	if (!gameFirebase.initialized){
        		gameFirebase.polyominoNum = gameFirebase.polyominoNum || 5;
        		gameFirebase.dimensions = gameFirebase.dimensions || 20;
        		gameFirebase.currentTurn = gameFirebase.currentTurn || 'blue';
        		gameFirebase.numColors = gameFirebase.numColors || 4;
        		gameFirebase.status = gameFirebase.status || "start";

        		var allPieces = [];
        		for(var x = 0; x < gameFirebase.polyominoNum; x++){
        			allPieces.push(x);
        		}
        		angular.forEach(gameFirebase.player, function(value, key){
        			gameFirebase.player[key].pieces = allPieces.join('|');
        		});

        		var obj = {};
        		var row = "";
        		for(var x = 0, len = gameFirebase.dimensions; x < len; x++){
        			row=row+"N";
        		}
        		for(var x = 0, len = gameFirebase.dimensions; x < len; x++){
        			obj["row"+x] = row;
        		}


        		gameFirebase.board = obj;
        		gameFirebase.initialized = true;
        		$rootScope.$emit("initialized", true)
        	}
        }
    }
});	
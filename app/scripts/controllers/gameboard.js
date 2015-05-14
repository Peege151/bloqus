'use strict';

angular.module('bloqusApp')
    .controller('GameCtrl', function ($scope, $stateParams, GameFactory){

    	console.log($stateParams);
    	GameFactory.onGameLoaded(function(fbaseObject){
    		$scope.game = fbaseObject;
    	});
    	console.log("Reaches here.")
        GameFactory.setGameFactory($stateParams.game.firebaseId, $stateParams.game.player);

    });
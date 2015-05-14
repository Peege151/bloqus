'use strict';

angular.module('bloqusApp')
    .controller('GameCtrl', function ($rootScope, $scope, $stateParams, GameFactory){

    	console.log($stateParams);
    	GameFactory.onGameLoaded(function(fbaseObject){
    		$scope.game = fbaseObject;
    	});
    	console.log("Reaches here.")
        GameFactory.setGameFactory($stateParams.game.firebaseId, $stateParams.game.player);

        $scope.pass = function(){
        	$rootScope.$emit("passTurn");
        }

    });
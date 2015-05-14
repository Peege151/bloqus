'use strict';

angular.module('bloqusApp')
    .controller('GameCtrl', function ($sce, $rootScope, $scope, $stateParams, GameFactory){

    	var thisBoard, thisPiece, thisColor

    	console.log($stateParams);
    	GameFactory.onGameLoaded(function(fbaseObject){
    		$scope.game = fbaseObject;
    	});
    	console.log("Reaches here.")
        GameFactory.setGameFactory($stateParams.game.firebaseId, $stateParams.game.player);

        $scope.pass = function(){
        	$rootScope.$emit("passTurn");
        }
        $scope.makeMove = function(){
            //$rootScope.$emit("makeMove");
            console.log("This,", thisPiece);
            console.log(thisColor);
            console.log(thisColor.toUpperCase().charAt(0));
           
            var moves = thisBoard.allLegalMovesForPieces(thisPiece, thisColor.toUpperCase().charAt(0));
            console.log("moves," , moves);
            var choice = Math.floor(Math.random() * moves.length);
            var id = moves[choice];
            console.log("Choice", id);
            $rootScope.$emit('makeMove', id);

        }

        $rootScope.$on('stateChanged', function(event, board, pieces, color){

        	thisBoard = board;
        	thisPiece = pieces[color];
        	thisColor = color;


        	$scope.boardHTML = $sce.trustAsHtml();
        	console.log(board, pieces);
        	var temp = "<div>"
        	for(var x = 0; x < board.dimensions; x++){
        		temp += "<div class='row'>"
        		for(var y = 0; y < board.dimensions; y++){
        			temp += "<div class='block " + board.getBoardSpot(y, x) + "'>";
        			temp += "</div>";
        		}
        		temp += "</div>"
        	}
        	temp += "</div>"
        	$scope.boardHTML = temp;
        	
        });



    });
'use strict';

angular.module('bloqusApp')
    .controller('GameCtrl', function ($sce, $rootScope, $scope, $stateParams, GameFactory){

    	var thisBoard, allPiece, thisColors, currentColor;

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
            console.log(thisColors)
            console.log(currentColor);
            if(thisColors.indexOf(currentColor) !== -1){
                console.log("This,", allPiece);
                console.log(thisColors);
                console.log(thisBoard.currentTurn.toUpperCase().charAt(0));
               
                var moves = thisBoard.allLegalMovesForPieces(allPiece[currentColor], currentColor.toUpperCase().charAt(0));
                console.log("moves," , moves);
                var choice = Math.floor(Math.random() * moves.length);
                var id = moves[choice];
                console.log("Choice", id);
                $rootScope.$emit('makeMove', id);
            }

        }


        $rootScope.$on('stateChanged', function(event, board, pieces, color, current){

            console.log("Board passed:  ", board);
            console.log("Pieces passed:  ", pieces);
            console.log("Color passed:  ", color);
            console.log("CurrentColor passed:  ", current);

        	thisBoard = board;
        	allPiece = pieces; //pieces[board.currentTurn];
        	thisColors = color;
            currentColor = current;

            //Render the board.
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



            //Render the pieces in question.

            var temp = temp + "<div>";
            for (var x = 0; x < pieces[current].length; x++){
                temp+="<div>";
       
                temp+="</div>";
            }
            temp += "</div>";

        	
        });



    });
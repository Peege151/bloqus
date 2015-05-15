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

            $scope.boardGrid = board.getBoard();

            //Render the pieces in question.
            //To do -- find the next color this person will play.
            //TODO: Abstract this out to a function elsewhere.
            var allColors = ["blue", "yellow", "red","green"];
            var nextColor;
            for(var x = allColors.indexOf(current); x < 8; x++){
                var particular = x % 4;
                if (color.indexOf(allColors[particular]) !== -1){
                    nextColor = allColors[particular];
                }
            }
            console.log("Next color to play, ", nextColor);




            var localPieces = pieces[nextColor];
            $scope.localPieces = localPieces;
            var visible = []
            for (var x = 0; x < localPieces.length; x++){

                var arrToPaint = [];
                var thisShape = localPieces[x].getPieceWithOrientation();
                var largest = thisShape.reduce(function(largest, current){return Math.max(largest, current[0], current[1])}, 0);

                for(var i = 0; i <= largest; i++){
                    arrToPaint.push([]);
                    for(var j = 0; j <= largest; j++){
                        var isItemThere = thisShape.some(function(a){return a[0] == i && a[1] == j});
                        if(isItemThere){
                            arrToPaint[i].push(nextColor.toUpperCase().charAt(0))
                        }else{
                            arrToPaint[i].push("T");
                        }
                        //.push(isItemThere ? nextColor.toUpperCase().charAt(0) : "N" );
                    }
                }

                visible.push(arrToPaint);
                //Draw it in a grid with largest dimensions.

            }


            $scope.pieces = visible;


            

        	
        });



    });
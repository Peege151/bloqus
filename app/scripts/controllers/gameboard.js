'use strict';

angular.module('bloqusApp')
    .controller('GameCtrl', function ($sce, $rootScope, $scope, $stateParams, GameFactory, LogicFactory){

    	var thisBoard, allPiece, thisColors, currentColor, localPieces, nextColor;
        var squareSize = 33.5;

        GameFactory.setGameFactory($stateParams.game.firebaseId, $stateParams.game.player);

        $scope.rotate = function(pieceInQuestion){
            console.log(pieceInQuestion)
            var thisPiece = localPieces[pieceInQuestion];
            thisPiece.rotateClockwise();
            $scope.renderMyPieces(localPieces);
            //pieceInQuestion.rotateClockwise();
        }

        $scope.flip = function(pieceInQuestion){
            console.log(pieceInQuestion)
            var thisPiece = localPieces[pieceInQuestion];
            thisPiece.flip();
            $scope.renderMyPieces(localPieces);
        }

        $scope.pass = function(){
        	$rootScope.$emit("passTurn");
        }

        $scope.dropPiece = function(evnt, data){
            console.log(evnt);
            console.log("data", data);

            var dropX = evnt.originalEvent.x;
            var dropY = evnt.originalEvent.y;

            var frameX = angular.element(document.querySelector('#frame')).prop('offsetLeft');
            var frameY = angular.element(document.querySelector('#frame')).prop('offsetTop');

            // console.log("Drop X", dropX);
            // console.log("Drop Y", dropY);
            // console.log("Frame X", frameX);
            // console.log("Frame Y", frameY);

            var fudgeY = evnt.currentTarget.clientHeight 

            var xPosition = dropX - frameX;
            var yPosition = dropY - frameY - fudgeY;

            var gridX = Math.round(xPosition / squareSize);
            var gridY = Math.round(yPosition / squareSize);
            console.log(data.piece)
            if(thisColors.indexOf(currentColor) !== -1){
                var move = new LogicFactory.Move(data.piece, [gridY, gridX], currentColor.toUpperCase().charAt(0))
                $rootScope.$emit("makeMove", move);
            }


            // console.log(gridX, gridY);

            // console.log(data);
        }
        $scope.makeMove = function(){
            //$rootScope.$emit("makeMove");
            // console.log(thisColors)
            // console.log(currentColor);
            if(thisColors.indexOf(currentColor) !== -1){
                // console.log("This,", allPiece);
                // console.log(thisColors);
                // console.log(thisBoard.currentTurn.toUpperCase().charAt(0));
               
                var moves = thisBoard.allLegalMovesForPieces(allPiece[currentColor], currentColor.toUpperCase().charAt(0));
                console.log("moves," , moves);
                var choice = Math.floor(Math.random() * moves.length);
                var id = moves[choice];
                console.log("Choice", id);
                $rootScope.$emit('makeMove', id);
            }

        }


        $rootScope.$on('stateChanged', function(event, board, pieces, color, current){

            // console.log("Board passed:  ", board);
            // console.log("Pieces passed:  ", pieces);
            // console.log("Color passed:  ", color);
            // console.log("CurrentColor passed:  ", current);

        	thisBoard = board;
        	allPiece = pieces; //pieces[board.currentTurn];
        	thisColors = color;
            currentColor = current;

            $scope.boardGrid = board.getBoard();

            //Render the pieces in question.
            //To do -- find the next color this person will play.
            //TODO: Abstract this out to a function elsewhere.
            var allColors = ["blue", "yellow", "red","green"];
            for(var x = allColors.indexOf(current); x < 8; x++){
                var particular = x % 4;
                if (color.indexOf(allColors[particular]) !== -1){
                    nextColor = allColors[particular];
                }
            }
            // console.log("Next color to play, ", nextColor);


            localPieces = pieces[nextColor];
            $scope.renderMyPieces(localPieces)


            

        	
        });

        $scope.renderMyPieces = function(myPieces){
            var localPieces = myPieces;
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

                visible.push({grid: arrToPaint, piece: localPieces[x]});
                //Draw it in a grid with largest dimensions.

            }


            $scope.pieces = visible;
        }



    });
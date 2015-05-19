'use strict';

angular.module('bloqusApp')
    .controller('GameCtrl', function ($sce, $rootScope, $scope, $stateParams, GameFactory, LogicFactory, localStorageService, $state){

    	var thisBoard, allPiece, thisColors, currentColor, localPieces, nextColor;
        var squareSize = 20.00;

        $scope.userColor = localStorageService.get('color');

        GameFactory.setGameFactory($stateParams.game.firebaseId, $stateParams.game.player);

        $scope.rotate = function(pieceInQuestion){
            console.log(pieceInQuestion)
            var thisPiece = localPieces[pieceInQuestion];
            thisPiece.rotateClockwise();
            $scope.renderMyPieces(localPieces);
            //pieceInQuestion.rotateClockwise();
        };

        $scope.flip = function(pieceInQuestion){
            console.log(pieceInQuestion)
            var thisPiece = localPieces[pieceInQuestion];
            thisPiece.flip();
            $scope.renderMyPieces(localPieces);
        };

        $scope.pass = function(){
        	$rootScope.$emit("passTurn");
        };


        $scope.dropPiece = function(evnt, data){

            var dropX = evnt.originalEvent.x;
            var dropY = evnt.originalEvent.y;

            var frameX = angular.element(document.querySelector('#frame')).prop('offsetLeft');
            var frameY = angular.element(document.querySelector('#frame')).prop('offsetTop');
            console.log("coords", dropX, dropY);
            // console.log("Drop X", dropX);
            // console.log("Drop Y", dropY);
            // console.log("Frame X", frameX);
            // console.log("Frame Y", frameY);

            var fudgeY = evnt.currentTarget.clientHeight;
            var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;



            var xPosition = dropX - frameX;
            var yPosition = dropY - frameY - fudgeY + scrollTop;

            var gridX = Math.round(xPosition / squareSize);
            var gridY = Math.round(yPosition / squareSize);

            //console.log(data.piece)
            if(thisColors.indexOf(currentColor) !== -1){
                var move = new LogicFactory.Move(data.piece, [gridY, gridX], currentColor.toUpperCase().charAt(0));

                //Add it to the local board, so we have the feeling 
                thisBoard.doMove(move);
                $scope.boardGrid = thisBoard.getBoard();

 
            //if(thisColors.indexOf(currentColor) !== -1){


                var move = new LogicFactory.Move(data.piece, [gridY, gridX], currentColor.toUpperCase().charAt(0))


                $rootScope.$emit("makeMove", move);
            }



            // console.log(gridX, gridY);

            // console.log(data);
        }
        $scope.makeMove = function(){


            if(thisColors.indexOf(currentColor) !== -1){

                var moves = thisBoard.allLegalMovesForPieces(allPiece[currentColor], currentColor.toUpperCase().charAt(0));

                var choice = Math.floor(Math.random() * moves.length);
                var id = moves[choice];

                $rootScope.$emit('makeMove', id);
            }

        }

        var go = $rootScope.$on('gameOver', function(event, game){
            console.log('HEARD THE GAME WAS OVER?')
            //Drop the event listeners attached to the global scope.
            go();
            sc();
            $state.go('gameover', {gameFirebase: game});
        });

        var sc = $rootScope.$on('stateChanged', function(event, board, pieces, color, current){
            console.log("The state has changed.")
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
                //console.log("asda," , x)
                var particular = x % 4;
                if (color.indexOf(allColors[particular]) !== -1){
                    nextColor = allColors[particular];
                    break;
                }
            }

            //$scope.noMoreMovesLeft();

            localPieces = pieces[nextColor];
            $scope.renderMyPieces(localPieces)

            $scope.currentColor = current;
        	
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
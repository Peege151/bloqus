'use strict';

angular.module('bloqusApp').factory("AgentFactory", function(LogicFactory){

	//takes a function which takes a
	var adapter = function(func){

		return function(board, allPieces, selves, currentTurn){

			//Grab all my pieces.  If I have none, pass.
			var myPieces = allPieces[currentTurn];
			if(myPieces.length == 0 || myPieces[0] == undefined){return {pass: true, move: null};}

			//Grab all my moves.  If I have none, pass.
			var allMoves = board.allLegalMovesForPieces(myPieces, currentTurn.toUpperCase().charAt(0));
			if (allMoves.length==0){return {pass: true, move: null};}

			return func(board, myPieces, allMoves, selves, currentTurn);

		}

	}

	var IdioticAI = function(board, myPieces, allMoves, selves, currentTurn){
		return {pass: false, move: allMoves[Math.floor(allMoves.length*Math.random())]};
	}



	var EasyAI = function(board, myPieces, allMoves, selves, currentTurn){

		var evaluator = function(move){
			var tempBoard = new LogicFactory.Board(board.dimensions);
			tempBoard.consumeFire(board.emitFire());
			tempBoard.doMove(move);

			//Favor moves which allow you to make more moves.

			var lengthFactor = tempBoard.liberties(currentTurn.toUpperCase().charAt(0)).length;
			var center = [ Math.round(board.dimensions / 2), Math.round(board.dimensions / 2) ];
			var accumDistanceToCenter = liberties.reduce(function(totalLength, spot){
				totalLength = totalLength + Math.sqrt(Math.pow(center[0]-spot[0],2) + Math.pow([center[1]-spot[1]],2));
				return totalLength;
			},0)
			var distFactor = - (accumDistanceToCenter / lengthFactor);
			var score = lengthFactor;
			return score;
		};

		var finalMove = allMoves.reduce(function(past, move){
			var valueOfMove = evaluator(move);
			return (past.value > valueOfMove) ? past : {move: move, value: valueOfMove };
		}, {move: allMoves[0], value: evaluator(allMoves[0])})

		return {pass: false, move: finalMove.move};
	};

	var MediumAI = function(board, myPieces, allMoves, selves, currentTurn){

		var evaluator = function(move, piecesLeft){
			var tempBoard = new LogicFactory.Board(board.dimensions);
			tempBoard.consumeFire(board.emitFire());
			tempBoard.doMove(move);
			console.log("Pieces Left: ", piecesLeft);
			console.log("TempBoard", tempBoard);
			var movesPossible = tempBoard.allLegalMovesForPieces(piecesLeft, currentTurn.toUpperCase().charAt(0));
			var lengthFactor = movesPossible.length;

			var center = [ Math.round(board.dimensions / 2), Math.round(board.dimensions / 2) ];
			var distanceToCenter = move.occupies().reduce(function(totalLength, spot){
				totalLength = totalLength + Math.sqrt(Math.pow(center[0]-spot[0],2) + Math.pow([center[1]-spot[1]],2));
				return totalLength;
			},0)
			var distFactor = - (distanceToCenter / move.occupies().length);

			var score = lengthFactor + distFactor;
			return score;
		};

		var statelessSplice = function(arr, index, length){
			return arr.slice(0, index).concat(arr.slice(index+length, arr.length));
		}

		var extRestOfPieces = allMoves.map(function(move){
				return move.piece;
			}).filter(function(otherPiece){
				return !otherPiece.sameShapeAtAll(allMoves[0].piece);
			});

		var finalMove = allMoves.reduce(function(past, move, index, arr){
			console.log("Index", index);
			console.log("MyPieces", allMoves);
			//Need to find all the pieces being used, minus the piece which is used in the current moved. 
			//This is a bit awkward and complicated.
			var restOfPieces = allMoves.map(function(move){
				return move.piece;
			}).filter(function(otherPiece){
				return !otherPiece.sameShapeAtAll(move.piece)
			});


			var valueOfMove = evaluator(move, restOfPieces);
			return (past.value > valueOfMove) ? past : {move: move, value: valueOfMove };
		}, {move: allMoves[0], value: evaluator(allMoves[0], extRestOfPieces)})

		return {pass: false, move: finalMove.move};
	};

	var agents = {
		'Idiotic AI': adapter(IdioticAI),
		'Easy AI': adapter(EasyAI),
		'Medium AI': adapter(MediumAI)
		//Hard: HardAI //haven't worked out how to do this yet.
	}

	return {

		//Returns a string with all of the names which have been defined.
		AgentNames: function(){
			return Object.keys(agents);
		},

		//Returns an agent, which is itself a function
		Agent: function(name){
			return agents[name];
		}


	}


});
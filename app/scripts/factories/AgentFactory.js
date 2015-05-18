'use strict';

angular.module('bloqusApp').factory("AgentFactory", function(){


	var IdioticAI = function(board, allPieces, selves, currentTurn){
		var myPieces = allPieces[currentTurn];
		var allMoves = board.allLegalMovesForPieces(myPieces, currentTurn.toUpperCase().charAt(0));
		var myMove = allMoves[Math.floor(allMoves.length*Math.random())];
		return myMove;
	}

	var EasyAI = function(board, allPieces, selves, currentTurn){
<<<<<<< Updated upstream
=======
		var myPieces = allPieces[currentTurn];
		if(myPieces.length==0){return {pass: true, move: null};}
		//console.log(" length for mypieces ", myPieces );
		//console.log("current ", currentTurn.toUpperCase().charAt(0) );
		//console.log(" selves ", selves );
		var allMoves = board.allLegalMovesForPieces(myPieces, currentTurn.toUpperCase().charAt(0));
		//console.log("All moves length for ", allMoves.length, currentTurn)
		if (allMoves.length==0){
			return {pass: true, move: null}
		}

		var evaluator = function(move){
			var tempBoard = new LogicFactory.Board(board.dimensions);
			tempBoard.consumeFire(board.emitFire());
			//console.log("TempBoard," , tempBoard)
			//console.log("Move,", move);
			tempBoard.doMove(move);

			var liberties = tempBoard.liberties(currentTurn.toUpperCase().charAt(0));
			//console.log(currentTurn, liberties.length);

			//More liberties is better than less, ceteris paribus.
			var lengthFactor = liberties.length;

			//Closer to the center is better than less close to the center, ceteris paribus.
			var center = [ Math.round(board.dimensions / 2), Math.round(board.dimensions / 2) ];
			var accumDistanceToCenter = liberties.reduce(function(totalLength, spot){
				totalLength = totalLength + Math.sqrt(Math.pow(center[0]-spot[0],2) + Math.pow([center[1]-spot[1]],2));
				return totalLength;
			},0)
			var distFactor = - (accumDistanceToCenter / lengthFactor);

			//Higher is better
			var score = lengthFactor + distFactor;
			return score;

		}

		var finalMove = allMoves.reduce(function(past, move){
			var valueOfMove = evaluator(move);
			return (past.value > valueOfMove) ? past : {move: move, value: valueOfMove };
		}, {move: allMoves[0], value: evaluator(allMoves[0])})

		return {pass: false, move: finalMove.move};
>>>>>>> Stashed changes

	}

	var MediumAI = function(board, allPieces, selves, currentTurn){

	}

	var agents = {
		Default: IdioticAI,
		Idiotic: IdioticAI,
		Easy: EasyAI,
		Medium: MediumAI
		//Hard: HardAI
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
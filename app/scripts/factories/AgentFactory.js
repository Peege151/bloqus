'use strict';

angular.module('bloqusApp').factory("AgentFactory", function(LogicFactory){

	//Pre-processing that all functions used to be doing before I abstracted it out.
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
		//Declar the evaluator used to find the best move of allMoves.
		var evaluator = function(move){
			//Find what the board looks like after the move gets made.
			var tempBoard = new LogicFactory.Board(board.dimensions);
			tempBoard.consumeFire(board.emitFire());
			tempBoard.doMove(move);

			//Favor moves which allow you to make more moves.
			var lengthFactor = tempBoard.liberties(currentTurn.toUpperCase().charAt(0)).length;

			//Calculate score and return score
			return lengthFactor;
		};

		//Find the best move, as evaluated by the evaluator.
		var finalMove = allMoves.reduce(function(past, move){
			var valueOfMove = evaluator(move);
			return (past.value > valueOfMove) ? past : {move: move, value: valueOfMove };
		}, {move: allMoves[0], value: evaluator(allMoves[0])})

		//Return it.
		return {pass: false, move: finalMove.move};
	};

	var MediumAI = function(board, myPieces, allMoves, selves, currentTurn){
		console.log("In Medium AI")
		var evaluator = function(move){

			//Get board after move.
			var tempBoard = new LogicFactory.Board(board.dimensions);
			tempBoard.consumeFire(board.emitFire());
			tempBoard.doMove(move);

			//Favor moves which allow you to make more moves.
			var lengthFactor = tempBoard.liberties(currentTurn.toUpperCase().charAt(0)).length;

			//And favor moves which bring you closer to the center of the board.
			var center = [ Math.round(board.dimensions / 2), Math.round(board.dimensions / 2) ];
			var distanceToCenter = move.occupies().reduce(function(totalLength, spot){
				totalLength = totalLength + Math.sqrt(Math.pow(center[0]-spot[0],2) + Math.pow([center[1]-spot[1]],2));
				return totalLength;
			},0)
			var distFactor = - (distanceToCenter / move.occupies().length);

			//And favor larger moves, simply speaking.
			var sizeFactor = move.occupies().length * 2;

			//Calculate and return score.
			return lengthFactor + distFactor + sizeFactor;
		};

		//Find the best move, as evaluated by the evaluator.
		var finalMove = allMoves.reduce(function(past, move){
			var valueOfMove = evaluator(move);
			return (past.value > valueOfMove) ? past : {move: move, value: valueOfMove };
		}, {move: allMoves[0], value: evaluator(allMoves[0])})

		//Return it.
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
			console.log("HERE");
			 console.log(name);
			console.log("Name was found?", this.AgentNames().indexOf(name) !== -1);
			// console.log("AFTER");
			return ( (this.AgentNames().indexOf(name) !== -1) ) ? agents[name] : agents["Medium AI"] //agents['Easy AI'];
		}


	}


});
'use strict';

angular.module('bloqusApp').factory("AgentFactory", function(){


	var IdioticAI = function(board, allPieces, selves, currentTurn){
		var myPieces = allPieces[currentTurn];
		var allMoves = board.allLegalMovesForPieces(myPieces, currentTurn.toUpperCase().charAt(0));
		var myMove = allMoves[Math.floor(allMoves.length*Math.random())];
		return myMove;
	}

	var EasyAI = function(board, allPieces, selves, currentTurn){

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
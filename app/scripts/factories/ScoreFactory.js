'use strict';

angular.module('bloqusApp')

    .factory('ScoreFactory', function ($firebaseObject, localStorageService, GameFactory) {

    		var scorer = function(board, players){

	            var redScore = 0;
	            var blueScore = 0;
	            var greenScore = 0; 
	            var yellowScore = 0;
	            var blankScore = 0;

				var players = GameFactory.getCurrentPlayers();

	            for(var row in board){
	                for(var i = 0; i < board[row].length; i++){
	                    if(board[row][i] == 'R') redScore++;
	                    if(board[row][i] == 'B') blueScore++;
	                    if(board[row][i] == 'G') greenScore++;
	                    if(board[row][i] == 'Y') yellowScore++;
	                    if(board[row][i] == 'N') blankScore++;
	                }
	            }

	            return {
	            	Red: {
						score: redScore,
						name: players.red.name,
						color: 'Red'
					},
	            	Blue: {
						score: blueScore,
						name: players.blue.name,
						color: 'Blue'
					},
	            	Yellow: {
						score: yellowScore,
						name: players.yellow.name,
						color: 'Yellow'
					},
	            	Green: {
						score: greenScore,
						name: players.green.name,
						color: 'Green'
					}
	            }

        	}

        	return scorer;

        }  );


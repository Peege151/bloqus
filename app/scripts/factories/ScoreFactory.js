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
				console.log('ALL PLAYERS!', players)

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
						name: players.red.name
					},
	            	Blue: {
						score: blueScore,
						name: players.blue.name
					},
	            	Yellow: {
						score: yellowScore,
						name: players.yellow.name
					},
	            	Green: {
						score: greenScore,
						name: players.green.name
					}
	            }

        	}

        	return scorer;

        }  );


'use strict';

angular.module('bloqusApp')

    .factory('ScoreFactory', function ($firebaseObject, localStorageService) {

    		var scorer = function(board){

	            var redScore = 0;
	            var blueScore = 0;
	            var greenScore = 0; 
	            var yellowScore = 0;
	            var blankScore = 0;

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
	            	Red: redScore,
	            	Blue: blueScore,
	            	Yellow: yellowScore,
	            	Green: greenScore
	            }

        	}

        	return scorer;

        }  );


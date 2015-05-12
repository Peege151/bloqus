var Board = function(){

}

Board.prototype.getBoard = function(){
	//returns multidimensional array
}

Board.prototype.getBoardSpot = function(x,y){
	//N (for blank) or RGBY
}

Board.prototype.liberties = function(side){
	//takes RGBY value, returns all the diagonals open which are not next to some kind of thing of the same color
	//i.e., all the places diagonal to the color indicated by side, which are not next to the same color
	//this should be really kinda useful for things all over the place
}

Board.prototype.doMove = function(move){
	//returns true if successful, false if it failed.
}

Board.prototype.isLegal = function(move){
	//Are any of the spaces it occupies off the board--if so, illegal.
	//Are any of the spaces it occupies already occupied--if so, illegal.
	//Are any of the spaces it is adjacent to the same color--if so, illegal.
	//Is one of the diagonals for it of the same color
}

Board.prototype.allLegalMoves = function(pieces, color){
	//returns whether a move is 
}

Board.prototype.allLegalMovesForPiece = function(piece, color){

}

Board.prototype.isOver = function(){
	//tells you if the game is over
}

//module.exports = Board
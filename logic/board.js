var Board = function(n){
	this.dimensions = n;
	this.board = helper.array2dFill(n,n,function(){return 'N'});
}

Board.prototype.getBoard = function(){
	return this.board;
}

Board.prototype.getBoardSpot = function(x,y){
	if ( x > this.dimensions -1 || y > this.dimensions - 1 || x < 0 || y < 0){return 'N';}
	return this.board[y][x];
}

Board.prototype.setBoardSpot = function(x,y, val){
	this.board[y][x] = val;
}

Board.prototype.liberties = function(side){
	//takes RGBY value, returns all the diagonals open which are not next to some kind of thing of the same color
	//i.e., all the places diagonal to the color indicated by side, which are not next to the same color
	//this should be really kinda useful for things all over the place
}

Board.prototype.doMove = function(move){
	if (this.isLegal(move)){
		var occupies = move.occupies();
		for(var x = 0; x < occupies.length; x++){
			var spot = occupies[x];
			this.setBoardSpot(spot[0],spot[1], move.color);
		}
		return true;
	}else{
		return false;
	}
}

Board.prototype.isLegal = function(move){

	//Are any of the spaces it occupies off the board--if so, illegal.
	//Are any of the spaces it occupies already occupied--if so, illegal.
	//Are any of the spaces it is adjacent to the same color--if so, illegal.
	//Is one of the diagonals for it of the same color--if so, true.

	var occupies = move.occupies();

	for(var x = 0; x < occupies.length; x++){
		var spot = occupies[x];
		//Off the board.
		if(spot[0] < 0 || spot[0] >= this.dimensions || spot[1] < 0 || spot[1] >= this.dimensions){
			return false;
		}
		if (this.getBoardSpot(spot[0],spot[1]) !== 'N'){
			return false
		}
	}
	console.log("passed occu");
	var adjacents = move.adjacencies();

	for(var x = 0; x < adjacents.length; x++){
		var spot = adjacents[x];
		if (this.getBoardSpot(spot[0],spot[1]) == move.color){
			console.log(this.getBoardSpot(spot[0],spot[1]));
			console.log("color: ", move.color);
			return false;
		}
	}
	console.log("passed adjacencies");

	var diags = move.legalDiagonals();
	for(var x = 0; x < diags.length; x++){
		var spot = diags[x];
		if(move.color == 'B' && spot[0] == -1 && spot[1] == -1){return true;}
		if(move.color == 'Y' && spot[0] == this.dimensions && spot[1] == -1){return true;}
		if(move.color == 'R' && spot[0] == this.dimensions && spot[1] == this.dimensions){return true;}
		if(move.color == 'G' && spot[0] == -1 && spot[1] == this.dimensions){return true;}
		if (this.getBoardSpot(spot[0],spot[1]) == move.color){
			return true;
		}
	}

	return false;

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
var Move = function(piece, location, side){
	this.piece = piece;
	this.location = location;
	this.side = side;
}

//returns the spaces that this move would occupy.
Move.prototype.occupies = function(){
	var self = this;
	return this
		.piece
		.getPieceWithOrientation()
		.map(function(square){
			return [square[0]+self.location[0], square[1]+self.location[1]];
		});
}

//Returns all of those places to which this move would be directl adjacent.
Move.prototype.adjacencies = function(){

}

Move.prototype.edges = function(){

}



//module.exports = Move
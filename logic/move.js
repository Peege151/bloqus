var Move = function(piece, location, color){
	this.piece = piece;
	this.location = location;
	this.color = color;
}

//returns the spaces that this move would occupy.
Move.prototype.occupies = function(){
	var self = this;
	return this
		.piece
		.getPieceWithOrientation()
		.map(function(square){
			return helper.addLocations(square, self.location);
		});
}

//Returns all of those places to which this move would be directly adjacent.
Move.prototype.adjacencies = function(){
	var adjacent = [[1,0],[-1,0],[0,1],[0,-1]];
	var occup = this.occupies();
	return occup
		.reduce(function(old, square){
			return old.concat(adjacent.map(function(adj){return helper.addLocations(square, adj)}));
		},[])
		.filter(function(adjacent, index, arr){
			return helper.specIndexOf(arr, adjacent) == index;
		})
		.filter(function(adjacent, index, arr){
			return helper.specIndexOf(occup, adjacent) == -1;
		});

}

Move.prototype.legalDiagonals = function(){
	var edgeSpots = [[1,1],[-1,-1],[-1,1],[1,-1]];
	var occup = this.occupies();
	var adjac = this.adjacencies();
	return occup
		.reduce(function(old, square){
			return old.concat(edgeSpots.map(function(edg){return helper.addLocations(square, edg)}));
		},[])
		.filter(function(edg, index, arr){
			return helper.specIndexOf(arr, edg) == index;
		})
		.filter(function(edg, index, arr){
			return helper.specIndexOf(occup, edg) == -1;
		})
		.filter(function(edg, index, arr){
			return helper.specIndexOf(adjac, edg) == -1;
		});
}

//If one move is equivalent to another, this says so.
Move.prototype.equals = function(other){
	return helper.sameArrElements(this.occupies(), other.occupies()) && other.color == this.color;
}



//module.exports = Move
var Piece = function(){
	this.flipped = false;
	this.rotated = 0;
	this.shape = [];
}
Piece.prototype.flip = function(){
	this.flipped = !this.flipped;

}
Piece.prototype.rotateClockwise = function(){
	this.rotated -= 90;
	if (this.rotated < 0) this.rotated += 360;

}
Piece.prototype.rotateCounterClockwise = function(){
	this.rotated += 90;
	if (this.rotated > 360) this.rotated -= 360;
}

Piece.prototype._rotate = function(spot, degree){
	var x = spot[0];
	var y = spot[1];
	if (degree == 0){return [x,y];}
	if (degree == 90){return [-y,x];}
	if (degree == 180){return [-x, -y];}
	if (degree == 270){return [y, -x];}
}

//Flips a thing, rotates it, and translates it so its edges are against the 0-0 x-y axis.
Piece.prototype.getPieceWithAlternateOrientation = function(flipped, rotated){
	var self = this;
	var lowestX = 100;
	var lowestY = 100;
	return this
		.shape
		.map(function(el){
			return (!flipped) ? el : [el[0],-el[1]];
		})
		.map(function(el){
			return self._rotate(el, rotated);
		})
		.map(function(el){
			lowestX = Math.min(el[0], lowestX);
			lowestY = Math.min(el[1], lowestY);
			return el;
		})
		.map(function(el){
			return [el[0]-lowestX,el[1]-lowestY];
		});
}

Piece.prototype.getPieceWithOrientation = function(){
	return this.getPieceWithAlternateOrientation(this.flipped, this.rotated);
}

Piece.prototype.sameShapeAtAll = function(other){
	var selfOrientations = this.allPieceOrientations();
	var otherOrientations = other.allPieceOrientations();
	for(var x = 0, len = selfOrientations.length; x < len; x++){
		for(var y = 0, innerLen = otherOrientations.length; y < innerLen; y++){
			if (helper.sameArrElements(selfOrientations[x], otherOrientations[y])){
				return true;
			}
		}
	}
	return false;
}

Piece.prototype.allPieceOrientations = function(){
	var ret = [];
	var self = this;
	for(var flipped = 0; flipped <= 1; flipped++){
		for(var deg = 0; deg < 360; deg = deg + 90){
			ret.push(this.getPieceWithAlternateOrientation(flipped, deg));
		}
	}
	return ret;
}

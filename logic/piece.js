var specIndexOf = function(arr, val){
	for(var x = 0 ; x < arr.length; x++){
		if(arr[x][0] === val[0] && arr[x][1] === val[1]){return x;}
	}
	return -1;
}

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

Piece.prototype.getPieceWithOrientation = function(){
	var self = this;
	var returnVal = this.shape.slice()
	if (this.flipped){
		returnVal = returnVal.map(function(el){
			return [el[0], -el[1]]
		});
	}
	returnVal = returnVal.map(function(el){
		return self._rotate(el, self.rotated);
	});
	return returnVal;
}

Piece.prototype.sameArrElements = function(one, two){
	if (one.length != two.length){return false;}
	var thisShape = one.slice();
	var otherShape = two.slice();
	for(var x = 0; x < thisShape.length; x++){
		var same = specIndexOf(otherShape, thisShape[x]);
		if (same === -1){
			return false;
		}
	}

	thisShape = two.slice();
	otherShape = one.slice();
	for(var x = 0; x < thisShape.length; x++){
		var same = specIndexOf(otherShape, thisShape[x]);
		if(same === -1){
			return false;
		}
	}

	return true;
}

Piece.prototype.sameShapeAtAll = function(other){
	var allOrientations = this.allPieceOrientations();
	var self = this;
	var sameShape = false;
	allOrientations.forEach(function(one){
		other.allPieceOrientations().forEach(function(two){
			if (self.sameArrElements(one, two)){
				sameShape = true;
				//console.log("One: ", one, "  Two: ", two);
			}else{
				
			}
		});
	});

	return sameShape;
}

Piece.prototype.allPieceOrientations = function(){
	var ret = [];
	var self = this;
	for(var flipped = 0; flipped <= 1; flipped++){
		for(var deg = 0; deg < 360; deg = deg + 90){
			var singleVal = this.shape.slice();
			var lowestX = 20;
			var lowestY = 20;
			if(flipped){
				singleVal = singleVal.map(function(el){
					return [el[0], -el[1]]
				});
			}
			singleVal = singleVal.map(function(el){
				return self._rotate(el, deg);
			});
			//offset for positive vals
			for(i = 0; i < singleVal.length; i++){
				if(singleVal[i][0] < lowestX){
					lowestX = singleVal[i][0];
				}
				if(singleVal[i][1] < lowestY){
					lowestY = singleVal[i][1];
				}
			}
			singleVal = singleVal.map(function(el){
				return [el[0] + (-lowestX), el[1] + (-lowestY)]
			});

			ret.push(singleVal);
		}
	}
	//console.log(ret)
	return ret;
}

module.exports = Piece
//
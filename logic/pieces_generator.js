var PiecesGenerator = function(num){

	var adjacent = [[0,1],[1,0],[-1,0],[0,-1]];
	var candidatePieces = [new Piece()];
	candidatePieces[0].shape = [[10,10]];

	for(var poly = 1; poly < num; poly++){
		var currLength = candidatePieces.length
		for(var x = 0; x < currLength; x++){
			var curPiece = candidatePieces[x];
			for(var y = 0; y < curPiece.shape.length; y++){
				var square = curPiece.shape[y]
				for(var z = 0; z < adjacent.length; z++){
					var candidateNewSquare = [ adjacent[z][0] + square[0], adjacent[z][1] + square[1] ];

					if (helper.specIndexOf(curPiece.shape, candidateNewSquare) == -1 && candidateNewSquare[0] >= 0 && candidateNewSquare [1] >= 0){
						var shape = curPiece.shape.slice();
						shape.push(candidateNewSquare);
						var newPiece = new Piece();
						newPiece.shape = shape;
						candidatePieces.push(newPiece);
					}
				}
			}
		}

		var pieces = [];
		for(var m = 0; m < candidatePieces.length; m++){
			if(!pieces.some(function(n){return n.sameShapeAtAll(candidatePieces[m])})){
				pieces.push(candidatePieces[m]);
			}
		}
		candidatePieces = pieces;
	}

	//This is not actually useless.
	for(var x = 0; x < candidatePieces.length; x++){
		var shape = candidatePieces[x].getPieceWithOrientation();
		candidatePieces[x].shape = shape;
	}

	return candidatePieces;

}
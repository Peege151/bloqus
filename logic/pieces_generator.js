var PiecesGenerator = function(num){

	//Returns the index of an array of length two, in an array of arrays of length two.
	var specIndexOf = function(arr, val){
		for(var x = 0 ; x < arr.length; x++){ if(arr[x][0] == val[0] && arr[x][1] == val[1]){return x}}
		return -1;
	}

	var adjacent = [[0,1],[1,0],[-1,0],[0,-1]];


	var candidatePieces = [new Piece()];
	candidatePieces[0].shape = [[10,10]];

	for(var poly = 1; poly < num; poly++){
		//console.log("Poly,", poly);
		var currLength = candidatePieces.length
		for(var x = 0; x < currLength; x++){

			//console.log("x", x);

			var curPiece = candidatePieces[x];
			for(var y = 0; y < curPiece.shape.length; y++){
				//console.log("pieces");
				var square = curPiece.shape[y]
				for(var z = 0; z < adjacent.length; z++){
					//console.log("!");
					var candidateNewSquare = [ adjacent[z][0] + square[0], adjacent[z][1] + square[1] ];

					if (specIndexOf(curPiece.shape, candidateNewSquare) == -1 && candidateNewSquare[0] >= 0 && candidateNewSquare [1] >= 0){
						var shape = curPiece.shape.slice();
						shape.push(candidateNewSquare);
						var newPiece = new Piece();
						newPiece.shape = shape;

						//var allOrientations = newPiece.allPieceOrientations();
						var alreadyExists = false;

						if (alreadyExists == false){
							//console.log("Added a piece on the ", poly, " iteration.");
							candidatePieces.push(newPiece);
						}
					}
				}
			}

		}

		var pieces = [];
		for(var m = 0; m < candidatePieces.length; m++){
			//var notThere = true;

			if(!pieces.some(function(n){return n.sameShapeAtAll(candidatePieces[m])})){
				pieces.push(candidatePieces[m]);
			}

			// for(var n = 0; n < pieces.length; n++){
			// 	if(pieces[n].sameShapeAtAll(candidatePieces[m])){
			// 		//console.log("Do you ever hit this?");
			// 		notThere = false;
			// 		n = pieces.length;
			// 	}
			// }
			// if(notThere){
				
			// }
		}
		candidatePieces = pieces;

	}

	for(var x = 0; x < candidatePieces.length; x++){

		var shape = candidatePieces[x].getPieceWithOrientation();
		candidatePieces[x].shape = shape;
		// var lowestY = 10;
		// var lowestX = 10;
		// for(i = 0; i < shape.length; i++){
		// 	if(shape[i][0] < lowestX){
		// 		lowestX = shape[i][0];
		// 	}
		// 	if(shape[i][1] < lowestY){
		// 		lowestY = shape[i][1];
		// 	}
		// }
		// shape = shape.map(function(el){
		// 	return [el[0] + (-lowestX), el[1] + (-lowestY)]
		// });
		// candidatePieces[x].shape = shape;
	}

	return candidatePieces;

}
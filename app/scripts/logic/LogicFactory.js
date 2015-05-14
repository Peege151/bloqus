(function () {

	'use strict';
	//alert();
	angular.module('bloqusApp').factory('LogicFactory', LogicFactory);
    
	function LogicFactory(){


		var helper = {

		    array2dFill: function(n,m,fill){
		    	var arr = [];
		    	for(var y = 0; y < n; y++){
		    		arr.push([]);
		    		for (var x = 0; x < m; x++){
		    			arr[y].push(fill(y,x));
		    		}
		    	}
		    	return arr;
		    },


			specIndexOf: function(arr, val){
				for(var x = 0 ; x < arr.length; x++){ if(arr[x][0] === val[0] && arr[x][1] === val[1]){return x;}}
				return -1;
			},

			sameArrElements:function(one, two){

				if (one.length != two.length){return false;}
				var thisShape = one.slice();
				var otherShape = two.slice();
				for(var x = 0; x < thisShape.length; x++){
					if(this.specIndexOf(otherShape, thisShape[x]) === -1){return false;}
					if(this.specIndexOf(thisShape, otherShape[x]) === -1){return false;}
				}

				return true;
			},


			deepEquals: function(obj1,obj2){
				var self = this;
		        return (Array.isArray(obj1))
		                ? obj1.every(function(n,i){return self.deepEquals(obj1[i], obj2[i]);})
		                : (obj1 == obj2);
			},

			addLocations: function(one, two){
				return [one[0]+two[0],one[1]+two[1]];
			}

		};

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






		var Board = function(n){
			this.dimensions = n;
			this.currentTurn = "";
			this.board = helper.array2dFill(n,n,function(){return 'N'});
		}

		Board.prototype.getBoard = function(){
			return this.board;
		}

		Board.prototype.getBoardSpot = function(x,y){
			if ( x > this.dimensions -1 || y > this.dimensions - 1 || x < 0 || y < 0){return 'N';}
			return this.board[x][y];
		}

		Board.prototype.setBoardSpot = function(x,y, val){
			this.board[x][y] = val;
		}

		Board.prototype.liberties = function(color){
			var self = this;
			//console.log("!");
			//finds open diags given color, also check to make sure adjacents are not same color.
			//array of arrays, subs length of 2 as coordinates possibly legal diags 
			//use getBoardSpot and setBoardSpot
			var liberties = [];
			var adjacents = [[1,0],[0,1],[-1,0],[0,-1]];
			var diags = [[1,-1],[1,1],[-1,1],[-1,-1]];
			for(var i=0; i < this.board.length; i++ ){
				for(var j=0; j < this.board.length; j++ ){
					var candidateCoords = [i,j]
					var spot = this.getBoardSpot(candidateCoords[0],candidateCoords[1])
					if (spot === color){
						for(var diag = 0; diag < diags.length; diag++){
						    var diagSpot = [candidateCoords[0] + diags[diag][0], candidateCoords[1] + diags[diag][1]];
						    if (this.getBoardSpot(diagSpot[0], diagSpot[1]) === 'N'){
						    	var isClean = true;
						    	for(var adj = 0; adj < adjacents.length; adj++){
								    var adjSpot = [diagSpot[0] + adjacents[adj][0], diagSpot[1] + adjacents[adj][1]];
								    if (this.getBoardSpot(adjSpot[0],adjSpot[1]) === color){
								    	isClean = false; break;
								    }
								}
						 		isClean && liberties.push(diagSpot)
						    }
						}
					}
				}
			}


			if(color == 'B' && this.getBoardSpot(0,0) == 'N'){liberties.push([0,0]);}
			if(color == 'Y' && this.getBoardSpot(this.dimensions-1, 0) == 'N'){liberties.push([this.dimensions-1,0]);}
			if(color == 'R' && this.getBoardSpot(this.dimensions-1, this.dimensions-1)){liberties.push([this.dimensions-1,this.dimensions-1]);}
			if(color == 'G' && this.getBoardSpot(0, this.dimensions-1)){liberties.push([0,this.dimensions-1]);}
			
			liberties =  liberties.filter(function(el, idx, arr){
				return helper.specIndexOf(arr, el) == idx && (el[0] >= 0) && (el[1] >= 0) && (el[0] < self.dimensions) && (el[1] < self.dimensions);
			});

			//console.log("lib", liberties);

			return liberties;

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
			//console.log("passed occu");
			var adjacents = move.adjacencies();

			for(var x = 0; x < adjacents.length; x++){
				var spot = adjacents[x];
				if (this.getBoardSpot(spot[0],spot[1]) == move.color){
					//console.log(this.getBoardSpot(spot[0],spot[1]));
					//console.log("color: ", move.color);
					return false;
				}
			}
			//console.log("passed adjacencies");

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

		Board.prototype.allLegalMovesForPieces = function(pieces, color){
			var allMoves = [];
			for(var x = 0; x < pieces.length; x++){
				//console.log("das")
				allMoves = allMoves.concat( this.allLegalMovesForPiece(pieces[x], color) );
			}
			return allMoves;
		}

		Board.prototype.allLegalMovesForPiece = function(piece, color){
			var self = this;
			var liberties = this.liberties(color);
			//console.log("Lib", liberties)
			var initialMoves = [];
			for(var x = 0; x < liberties.length; x++){

				//console.log("f", flipped);
				//For each possibility
				var spot = liberties[x]
				for(var fli = 0; fli <= 1; fli++){
					var flipped = !!fli;
					for(var deg = 0; deg < 360; deg=deg+90){
						//console.log("f", flipped)
						var thisPiece = new Piece();
						thisPiece.shape = piece.shape;
						thisPiece.flipped = flipped;
						thisPiece.rotated = deg;
						//console.log(thisPiece);
						var untranslated = new Move(thisPiece, spot, color);
						//if this.isLegal(untranslated){initialMoves.push(untranslated);}
						var translationalPossibilities = untranslated.occupies().filter(function(el){
							return el[0] == spot[0] || el[1] == spot[1];
						}).map(function(el){
							return [ spot[0] + spot[0] - el[0], spot[1] + spot[1] - el[1] ];
						});
						//console.log(translationalPossibilities.length);
						for(var m = 0; m < translationalPossibilities.length; m++){
							var translated = new Move(thisPiece, translationalPossibilities[m], color);
							if (this.isLegal(translated)){initialMoves.push(translated)}
						}
					}
				}

			}

			//get rid of stuff which is duplicate, given that the above could have repeats;
			var finalMoves = [];
			for (var y = 0; y < initialMoves.length; y++){
				var unique = true;
				for (var z = 0; z < y; z++){
					if (initialMoves[y].equals(initialMoves[z])){
						unique = false;
						break;
					}
				}
				unique && finalMoves.push(initialMoves[y]);
			}

			return finalMoves;
		}

		Board.prototype.consumeFire = function(fire){
			var len = fire['row0'].length
			var ret = [];
			for(var y = 0; y < len; y++){
				ret.push([]);
				for(var x = 0; x < len; x++){
					this.setBoardSpot(x, y, fire['row'+y].charAt(x));
				}
			}
		}

		Board.prototype.emitFire = function(){

			var ret = {};
			var len = this.dimensions;
			for(var y = 0; y < len; y++){
				ret['row'+y] = "";
				for(var x = 0; x < len; x++){
					ret['row'+y] = ret['row'+y] + this.getBoardSpot(x,y);
				}
			}
			return ret;
		}

		Board.prototype.isOver = function(){
			//tells you if the game is over
		}



		var logic = {
			helper: helper,
			Move: Move,
			Piece: Piece,
			PiecesGenerator,
			Board: Board
		}
		return logic;
	}


})();
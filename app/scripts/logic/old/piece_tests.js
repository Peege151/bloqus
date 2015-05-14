describe("Pieces_Generator", function(){
	it('should exist', function () {
	    expect(PiecesGenerator).to.be.a('function');
	});
	it('should generate peices', function () {
		expect(PiecesGenerator(1).length).to.equal(1);
		//console.log(PiecesGenerator(2).map(function(n){return  n.shape}))
		expect(PiecesGenerator(2).length).to.equal(2);

		//console.log(PiecesGenerator(3).map(function(n){return  n.shape}))
		expect(PiecesGenerator(3).length).to.equal(4);
		//console.log(PiecesGenerator(3).map(function(n){return  n.shape}))

		expect(PiecesGenerator(4).length).to.equal(9);

	    expect(PiecesGenerator(5).length).to.equal(21);
	    expect(PiecesGenerator(6).length).to.equal(56);
	});
});

describe("Piece", function(){
	it('should exist', function () {
	    expect(Piece).to.be.a('function');
	});
	it('should have properties of flipped, rotated', function () {
	    var newPiece = new Piece()
	    newPiece.shape = [[0,0],[1,0],[2,0]];
	    expect(newPiece.flipped).to.equal(false);
	    expect(newPiece.rotated).to.equal(0)
	});

	//Old tests for when rotation / translation didn't move things into the positive zone automatically.
	//Yeah.  If we decide to go back, these should be reopened.
	//
	// it('should respond appropriately when flipped', function () {
	//     var newPiece = new Piece()
	//     newPiece.shape = [[0,0],[1,0],[1,1],[2,0]];
	//     newPiece.flip()
	//     expect(helper.deepEquals(newPiece.getPieceWithOrientation(), ([[0,0],[1,0],[1,-1],[2,0]]))).to.be.okay
	// });
	// it('should respond appropriately when rotated', function () {
	//     var newPiece = new Piece()
	//     newPiece.shape = [[0,0],[1,0],[1,1],[2,0]];
	//     newPiece.rotateCounterClockwise()
	//     expect(helper.deepEquals(newPiece.getPieceWithOrientation(), [[0,0],[0,1],[1,-1],[0,2]])).to.be.okay
	//     newPiece.rotateCounterClockwise()
	//     expect(helper.deepEquals(newPiece.getPieceWithOrientation(), [[0,0],[-1,0],[-1,-1],[-2,0]])).to.be.okay
	//     newPiece.rotateCounterClockwise()
	//     expect(helper.deepEquals(newPiece.getPieceWithOrientation(), [[0,0],[0,-1],[1,-1],[0,-2]])).to.be.okay
	//     newPiece.rotateClockwise();
	//     expect(helper.deepEquals(newPiece.getPieceWithOrientation(), [[0,0],[-1,0],[-1,-1],[-2,0]])).to.be.okay
	// });
	it('should respond appropriately when flipped', function () {
	    var newPiece = new Piece()
	    newPiece.shape = [[0,0],[1,0],[1,1],[2,0]];
	    newPiece.flip()
	    expect(helper.deepEquals(newPiece.getPieceWithOrientation(), ([[0,1],[1,1],[1,0],[2,1]]))).to.equal(true)
	});
	
	it('should respond appropriately when rotated', function () {
	    var newPiece = new Piece()
	    newPiece.shape = [[0,0],[1,0],[1,1],[2,0]];
	    newPiece.rotateCounterClockwise()
	    //console.log(newPiece.getPieceWithOrientation());
	    expect(helper.deepEquals(newPiece.getPieceWithOrientation(), [[1,0],[1,1],[0,1],[1,2]])).to.equal(true);
	    newPiece.rotateCounterClockwise();
	    //console.log(newPiece.getPieceWithOrientation());
	    expect(helper.deepEquals(newPiece.getPieceWithOrientation(), [[2,1],[1,1],[1,0],[0,1]])).to.equal(true);
	    newPiece.rotateCounterClockwise()
	    expect(helper.deepEquals(newPiece.getPieceWithOrientation(), [[0,2],[0,1],[1,1],[0,0]])).to.equal(true);
	    newPiece.rotateClockwise();
	    expect(helper.deepEquals(newPiece.getPieceWithOrientation(), [[2,1],[1,1],[1,0],[0,1]])).to.equal(true);
	});

	it('should respond appropriately when flipped AND rotated', function () {
	    var newPiece = new Piece()
	    newPiece.shape = [[0,0],[1,0],[1,1],[2,0]];
	    newPiece.flip()
	    newPiece.rotateCounterClockwise()
	    expect(helper.deepEquals(newPiece.getPieceWithOrientation(), ([[0,0],[0,1],[1,1],[0,2]]))).to.equal(true);
	});

	it('should be able to give you an array of all possible values', function(){
		var newPiece = new Piece()
	    newPiece.shape = [[0,0],[1,0],[0,1]];
	    expect(newPiece.allPieceOrientations().length).to.equal(8);
	    //console.log(newPiece.allPieceOrientations());
	});

	describe('should be able to see if it has the same shape as another piece', function(){
		it('can tell it has the same shape, disordered, as another piece', function(){
			var newPiece = new Piece()
		    newPiece.shape = [[0,0],[1,0],[1,1],[2,0]];
		    var otherPiece = new Piece()
		    otherPiece.shape = [[1,0],[0,0],[2,0],[1,1]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(true);
		    var badPiece = new Piece()
		    otherPiece.shape = [[1,0],[1,0],[2,0],[1,1]];
		    expect(newPiece.sameShapeAtAll(badPiece)).to.equal(false);
		    newPiece.shape = [[0,0],[1,0]];
		    otherPiece.shape = [[1,0],[0,0]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(true);
		   	newPiece.shape = [[0,0],[1,0],[1,1]];
		    otherPiece.shape = [[1,0],[0,0],[1,1]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(true);
		   	newPiece.shape = [[0,0],[1,0]];
		    otherPiece.shape = [[1,0],[0,0],[1,1]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(false);

		 });

		it('can tell it has the same shape, rotate or translated all over the place, as another shape', function(){
			var newPiece = new Piece()
			var otherPiece = new Piece()
		    newPiece.shape = [[0,1],[0,0]];
		    otherPiece.shape = [[1,0],[0,0]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(true);

		    newPiece.shape = [[0,-1],[0,-2]];
		    otherPiece.shape = [[1,0],[0,0]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(true);

		    newPiece.shape = [[0,-1],[0,-2],[1,-1]];
		    otherPiece.shape = [[1,0],[0,0],[0,1]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(true);	    

		   	newPiece.shape = [];
		    otherPiece.shape = [[1,0],[0,0],[1,1]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(false);

		    newPiece.shape = [[0,0]];
		    otherPiece.shape = [[0,0],[0,1],[1,1]];
		    expect(newPiece.sameShapeAtAll(otherPiece)).to.equal(false);
		});
	});
});




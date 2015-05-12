describe("Moves", function(){

	var newPiece, otherPiece;

	it('should exist', function () {
	    expect(Move).to.be.a('function');
	});

	//should test Move.prototype.occupies
	describe('should be able to show the places it would occupy', function(){
		beforeEach(function(){
			newPiece = new Piece();
		    newPiece.shape = [[0,0],[1,0],[2,0],[1,1]];
		    otherPiece = new Piece()
		    otherPiece.shape = [[0,0],[1,0],[1,1],[2,1]];
		});

		it('should be able to give a list of the places it would occupy', function(){
			var move = new Move(newPiece, [5,10],'Y');
			var otherMove = new Move(otherPiece, [10,5],'Y');
			//console.log(otherMove.occupies());
			expect(helper.deepEquals(move.occupies(), [[5,10],[6,10],[7,10],[6,11]])).to.equal(true);
			expect(helper.deepEquals(otherMove.occupies(), [[10,5],[11,5],[11,6],[12,6]])).to.equal(true);
		});

		it('should be able to show the places it would occupy when rotated', function(){
			newPiece.rotateCounterClockwise();
			otherPiece.rotateCounterClockwise();
			var move = new Move(newPiece, [5,10],'Y');
			var otherMove = new Move(otherPiece, [10,5],'Y');
			//console.log(move.occupies());
			expect(helper.deepEquals(move.occupies(), [[6,10],[6,11],[6,12],[5,11]])).to.equal(true);
			expect(helper.deepEquals(otherMove.occupies(), [[11,5],[11,6],[10,6],[10,7]])).to.equal(true);
		});

		it('should be able to show the places it would occupy when flipped', function(){
			newPiece.flip();
			var move = new Move(newPiece, [5,5], 'Y');
			expect(helper.deepEquals(move.occupies(),[[],[],[],[]]))
		});

	});


	//should tests Move.prototype.adjacencies
	describe('should be able to give list of places it would be adjacent to', function(){	
		beforeEach(function(){
			newPiece = new Piece();
		    newPiece.shape = [[0,0],[1,0],[2,0],[1,1]];
		    otherPiece = new Piece()
		    otherPiece.shape = [[0,0],[1,0],[1,1],[2,1]];
		});
		
		it('should be able to show the places it would be adjacent to translated (board co-ords), without repeats', function(){
			var move = new Move(newPiece, [5,10],'Y');
			expect(move.adjacencies().length).to.equal(8);
			
		});

		xit('should be able to show the places it would be adjacent to rotated, without repeats', function(){
			var move = new Move(newPiece, [4,3], 'G');
			expect(helper.sameArrElements(move.adjacencies(),[[3,3],[4,2],[5,2],[6,2],[7,3],[6,4],[5,5],[4,4]])).to.equal(true);
			var otherMove = new Move(newPiece, [4,3], 'G');
			newPiece.rotateCounterClockwise();
			expect(helper.sameArrElements(otherMove.adjacencies(),[[5,2],[6,3],[6,4],[6,5],[5,6],[4,5],[3,4],[4,3]])).to.equal(true);
		});

		xit('should be able to show the places it would be adjacent to flipped, without repeats', function(){
			var move = new Move(newPiece, [4,3], 'G');
			expect(helper.sameArrElements(move.adjacencies(),[[3,3],[4,2],[5,2],[6,2],[7,3],[6,4],[5,5],[4,4]]).to.equal(true);
			var otherMove = new Move(newPiece, [4,3], 'G');
			newPiece.flip();
			expect(helper.sameArrElements(move.adjacencies(),[[5,2],[6,3],[7,4],[6,3],[7,4],[6,5],[5,5],[4,5],[3,4],[4,2]])).to.equal(true);
		});

	})


	//should test Move.prototype.edges
	describe('should be able to show the legal places it would be diagonal to', function(){
		beforeEach(function(){
			newPiece = new Piece();
		    newPiece.shape = [[0,0],[1,0],[2,0],[1,1]];
		    otherPiece = new Piece()
		    otherPiece.shape = [[0,0],[1,0],[1,1],[2,1]];
		});

		xit('should be able to show the places it would be diagonal to translated', function(){
			var move = new Move(newPiece, [4,3], 'G');
			expect(helper.sameArrElements(move.legalDiagonals(),[[3,2],[7,2],[7,4],[6,5],[4,5],[3,4]])).to.equal(true);
		});

		xit('should be able to show the places it would be diagonal to rotated', function(){
			var move = new Move(newPiece, [4,3], 'G');
			move.rotateCounterClockwise();
			expect(helper.sameArrElements(move.legalDiagonals(),[[4,2],[6,2],[6,6],[4,6],[3,5],[3,3]])).to.equal(true);
		});

		xit('should be able to show the places it would be diagonal to flipped', function(){
			var move = new Move(newPiece, [4,3], 'G');
			move.flip();
			expect(helper.sameArrElements(move.legalDiagonals(),[[3,3],[4,2],[6,2],[7,3],[7,5],[3,5]])).to.equal(true);
		});


	});

});
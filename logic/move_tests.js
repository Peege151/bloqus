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

		it('should be able to show the places it would be adjacent to translated, without repeats', function(){
			var move = new Move(newPiece, [5,10],'Y');
			expect(helper.deepEquals(move.adjacencies().length)).to.equal(8);
			
		});

		it('should be able to show the places it would be adjacent to rotated, without repeats', function(){

		});

		it('should be able to show the places it would be adjacent to flipped, without repeats', function(){

		});

	})


	//should test Move.prototype.edges
	describe('should be able to show the places it would be diagonal to', function(){

		xit('should be able to show the places it would be diagonal to translated', function(){

		});

		xit('should be able to show the places it would be diagonal to rotated', function(){

		});

		xit('should be able to show the places it would be diagonal to flipped', function(){

		});


	});

});
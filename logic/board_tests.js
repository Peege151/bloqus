describe("Board", function(){

	var newPiece, nb, otherPiece;

	beforeEach(function(){
		nb = new Board(20);
		newPiece = new Piece();
	    newPiece.shape = [[0,0],[1,0],[2,0],[1,1]];
	    otherPiece = new Piece()
	    otherPiece.shape = [[0,0],[1,0],[1,1],[2,1]];
	});

	it('should exist', function () {
	    expect(Board).to.be.a('function');
	});

	it('can make a board, and make a multidimensional array from it', function(){
		var nb = new Board(20);
		console.log(nb.getBoard())
		expect(nb.getBoard().length == 20).to.equal(true);
		expect(nb.getBoard()[0].length == 20).to.equal(true);
		expect(nb.getBoardSpot(0,0) == 'N').to.equal(true);
		expect(nb.getBoardSpot(3,3) == 'N').to.equal(true);
	});


	//NB: This should check whether it is legal.
	describe('it should accept / reject moves, insofar as they are ok', function(){

		it('should accept legal moves which go from starting position', function(){
			var oneMove = new Move(newPiece, [0,0], 'B')
			console.log(oneMove);
			expect(nb.doMove(oneMove)).to.equal(true);
			oneMove = new Move(newPiece, [5,5], 'B');
			expect(nb.doMove(oneMove)).to.equal(false);
		});

		it('should accept legal moves which go from some other piece', function(){
			var oneMove = new Move(newPiece, [0,0], 'B')
			nb.doMove(oneMove);
			oneMove = new Move(newPiece, [2,2], 'B');
			expect(nb.doMove(oneMove)).to.equal(true);
		});

		it('should reject moves that place it adjacent to another piece', function(){
			var oneMove = new Move(newPiece, [0,0], 'B')
			nb.doMove(oneMove);
			oneMove = new Move(newPiece, [0,2], 'B');
			expect(nb.doMove(oneMove)).to.equal(false);
		});

	 	it('should reject moves that make it overlap another piece', function(){
			var oneMove = new Move(newPiece, [0,0], 'B')
			nb.doMove(oneMove);
			oneMove = new Move(newPiece, [1,1], 'B');
			expect(nb.doMove(oneMove)).to.equal(false);
		});

		it('has changed color after a move is plaed', function(){
			var oneMove = new Move(newPiece, [0,0], 'B')
			nb.doMove(oneMove);
			expect(nb.getBoardSpot(0,0)).to.equal('B');
			expect(nb.getBoardSpot(1,0)).to.equal('B');
			expect(nb.getBoardSpot(2,0)).to.equal('B');
			expect(nb.getBoardSpot(1,1)).to.equal('B');
		});

	});

	describe('it should be able to tell you what legal moves are', function(){

			it('has a liberties function, which gives you the free spots on the board', function(){
				var oneMove = new Move(newPiece, [0,0], 'B');
				nb.doMove(oneMove);
				expect(nb.liberties('B').length).to.equal(3);
				expect(helper.sameArrElements(nb.liberties('B'), [[3,1],[2,2],[0,2]]));
				newPiece.rotateCounterClockwise();
				oneMove = new Move(newPiece, [0,0], 'B');
				expect(nb.liberties('B').length).to.equal(2);
				expect(helper.sameArrElements(nb.liberties('B'), [[0,3],[2,3]]));
			});

			xit('should be able to say what all the legal moves are, for a single piece and a single color, passed to it', function(){

			});

			xit('should be able to say what all the legal moves are, for an array of pieces and a single color, passed to it', function(){

			});

	});

	describe('has some higher level stuff', function(){
		//Alternately, a higher-level thing than board could keep track of this.
		xit('should be able to say when the game is over--when no one has moves', function(){

		});
	})


});
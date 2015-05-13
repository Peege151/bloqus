describe("Board", function(){

	var newPiece, nb, otherPiece;

	beforeEach(function(){
		nb = new Board(20);
		newPiece = new Piece();
	    newPiece.shape = [[0,0],[1,0],[2,0],[1,1]];
	    otherPiece = new Piece()
	    otherPiece.shape = [[0,0],[1,0],[1,1],[2,1]];
	    crossPiece = new Piece();
	    crossPiece.shape = [[1,1],[1,0],[0,1],[2,1],[1,2]];
	});

	it('should exist', function () {
	    expect(Board).to.be.a('function');
	});

	it('can make a board, and make a multidimensional array from it', function(){
		var nb = new Board(20);
		//console.log(nb.getBoard())
		expect(nb.getBoard().length == 20).to.equal(true);
		expect(nb.getBoard()[0].length == 20).to.equal(true);
		expect(nb.getBoardSpot(0,0) == 'N').to.equal(true);
		expect(nb.getBoardSpot(3,3) == 'N').to.equal(true);
	});


	//NB: This should check whether it is legal.
	describe('it should accept / reject moves, insofar as they are ok', function(){

		it('should accept legal moves which go from starting position', function(){
			var oneMove = new Move(newPiece, [0,0], 'B')
			//console.log(oneMove);
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
			});

			it('has a liberties function, which gives you the free spots on the board when rotated', function(){
				newPiece.rotateClockwise();
				var oneMove = new Move(newPiece, [0,0], 'B');
				nb.doMove(oneMove);
				expect(nb.liberties('B').length).to.equal(3);
				expect(helper.sameArrElements(nb.liberties('B'), [[2,0],[2,2],[3,1]]));
			});

			it('has a liberties function, which gives you the free spots on the board in a more complex situation', function(){
				newPiece.rotateClockwise();
				var oneMove = new Move(newPiece, [0,0], 'B');
				var twoMove = new Move(crossPiece, [1,2], 'B');
				nb.doMove(oneMove);
				nb.doMove(twoMove);
				expect(nb.liberties('B').length).to.equal(7);
				expect(helper.sameArrElements(nb.liberties('B'), [[2,0],[3,1],[4,2],[4,4],[3,5],[1,5],[0,4]]));
			});

			it('should be able to say what all the legal moves are, for a single piece and a single color, passed to it, when nothing is on the board', function(){
				var answer = nb.allLegalMovesForPiece(newPiece, 'B')
				//console.log(answer);
				expect(answer.length).to.equal(2)
			});

			it('should be able to say what all the legal moves are, for a single piece and a single color, passed to it, when stuff is on the board', function(){
				var oneMove = new Move(newPiece, [0,0], 'B');
				nb.doMove(oneMove);
				var answer = nb.allLegalMovesForPiece(newPiece, 'B')
				expect(answer.length).to.equal(11)
			});

			it('should be able to say what all the legal moves are, for an array of pieces and a single color, passed to it', function(){
				one = new Piece()
				one.shape = [[0,0],[0,1]];
				two = new Piece();
				two.shape = [[0,0],[0,1],[0,2]];
				three = new Piece();
				three.shape = [[0,0],[1,1],[0,1]];
				var done = nb.allLegalMovesForPieces([one,two,three], 'B');
				expect(done.length).to.equal(7);
				console.log(done);

				three.rotateCounterClockwise();
				var move = new Move(three,[0,0],'B');
				nb.doMove(move);
				done = nb.allLegalMovesForPieces([one,two], 'B');
				expect(done.length).to.equal(8);

				done = nb.allLegalMovesForPieces([one,two,three], 'B');
				expect(done.length).to.equal(17);
			});

	});

	describe('has some higher level stuff', function(){
		//Alternately, a higher-level thing than board could keep track of this.
		xit('should be able to say when the game is over--when no one has moves', function(){

		});

		xit('should do something else', function(){

		});

	});

});
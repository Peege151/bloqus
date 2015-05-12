describe("Board", function(){
	it('should exist', function () {
	    expect(Board).to.be.a('function');
	});

	it('can make a board, and make a multidimensional array from it', function(){
		var nb = new Board(20);
		console.log(nb.getBoard())
		expect(nb.getBoard().length == 20).to.equal(true);
		expect(nb.getBoard()[0].length == 20).to.equal(true);
	});


	//NB: This should check whether it is legal.
	xit('should accept moves', function(){

	});

	xit('should be able to return an array of the entire board', function(){
		//Should probably parse out however this is stored (a bunch of strings, which are rows), into a multi dimensional array of single characters.
	});

	xit('should be able to return a particular spot on the board', function(){

	});

	//Should have as input a move.
	xit('should be able to say whether a particular move passed to it is legal', function(){
		//Are any of the spaces it occupies off the board--if so, illegal.
		//Are any of the spaces it occupies already occupied--if so, illegal.
		//Are any of the spaces it is adjacent to the same color--if so, illegal.
		//Is one of the diagonals for it of the same color
	});

	xit('should be able to say what all the legal moves are, for a single piece and a single color, passed to it', function(){

	});

	xit('should be able to say what all the legal moves are, for an array of pieces and a single color, passed to it', function(){

	});

	//Alternately, a higher-level thing than board could keep track of this.
	xit('should be able to say when the game is over--when no one has moves', function(){

	});

});
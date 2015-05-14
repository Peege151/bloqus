var expect = chai.expect;

describe('Statics', function(){

	it('can identify arrays of (arrays with length two) with the same elements, disordered', function(){
		var newPiece = new Piece();
		expect(helper.sameArrElements([[1,1],[0,0]],[[0,0],[1,1]])).to.equal(true);
		expect(helper.sameArrElements([[1,0],[0,0]],[[0,0],[1,1]])).to.equal(false);
	});

});
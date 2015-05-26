angular.module('bloqusApp')
.directive("pieces", function ($window){
	return {
		restrict: "E",
		scope:true,
		templateUrl: 'scripts/directives/pieces.html',
		link: function(s,e,a){
			var divisor = 45
			var squareSize = 0
			s.$evalAsync(function(){
				if(window.innerWidth > 1300 && s.boardGrid.length == 30){
					squareSize = 19.0;	
					console.log("Sqsize set", squareSize)	
				} 
				if(window.innerWidth > 1300 && s.boardGrid.length == 20){
					squareSize = 27
				} 
				if(window.innerWidth < 1300 && window.innerWidth > 768) {
					squareSize = (window.innerWidth / divisor) / (s.boardGrid.length / 20) 
				}
				var blocks = e[0].children
				for(var i = 0; i < blocks.length; i++){
					//blocks[i].width(squareSize)
					//blocks[i].height(squareSize)
					angular.element(blocks[i]).width(squareSize)
					angular.element(blocks[i]).height(squareSize)
				}

			})
		}
	}
})
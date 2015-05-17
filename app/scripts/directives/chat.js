angular.module('bloqusApp')
.directive("chat", function(){
	return {
		restrict: "E",
		templateUrl: 'scripts/directives/chat.html',
		controller: "ChatCtrl",
		scope: {current: '='},
		link: function(s,e,a){
			//s.currentI = a.currentId;
		}
	}
})
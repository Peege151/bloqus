angular.module('bloqusApp')
  .filter('capital', function() {
  return function(input) {
  	if(!!input){
    	return input[0].toUpperCase() + input.split("").splice(1,input.length).join("");
	}else{
		return "";
	}
  };
});

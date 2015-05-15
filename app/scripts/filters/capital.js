angular.module('bloqusApp')
  .filter('capital', function() {
  return function(input) {
    return input[0].toUpperCase() + input.split("").splice(1,input.length).join("")
  };
});

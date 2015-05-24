angular.module('bloqusApp')
    .filter('scoreSort', function() {
    return function(items, score, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[score] > b[score] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});

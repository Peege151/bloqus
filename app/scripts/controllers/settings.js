'use strict';
angular.module('bloqusApp')
    .controller("SettingsCtrl", function ($scope, localStorageService, UserFactory) {
        var email = localStorageService.get('email');
        console.log('email in controller: ', email)
        $scope.stats = [];

        console.log('stats', $scope.stats)

        var getStats = function () {
            return UserFactory.getStats(email).then( function(stats){
                console.log('getStats()', stats)
                $scope.stats = stats;
            })
        };

        getStats();

        console.log('stats after db call ', $scope.stats)

    });
'use strict';

angular.module('bloqusApp')

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })

      .when('/lobby', {
        templateUrl: 'views/lobby.html',
        controller: 'LobbyCtrl'
      })
      .otherwise({redirectTo: '/'});
  }]);

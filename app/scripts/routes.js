'use strict';

angular.module('bloqusApp')

    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })

            .state('lobby', {
                url: '/lobby',
                templateUrl: 'views/lobby.html',
                controller: 'LobbyCtrl'
            })

    });

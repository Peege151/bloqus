'use strict';

angular.module('bloqusApp')

    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })

            .state('lobby', {
                url: '/lobby/:currentId/:shareId',
                templateUrl: 'views/lobby.html',
                controller: 'LobbyCtrl'
            })

            .state('gameboard', {
                url: '/game/',
                params: {game: {
                    firebaseId: "",
                    player: ""
                }},
                templateUrl: 'views/gameboard.html',
                controller: 'GameCtrl'
            })

            .state('gameover', {
                url: '/gameover',
                templateUrl: 'views/gameover.html',
                params: {game: {}},
                controller: 'GameOverCtrl'
            });

        //$locationProvider.html5Mode(true);

    });

'use strict';

angular.module('bloqusApp')

.controller("MainCtrl", function($scope, $firebaseObject) {
  var ref = new Firebase("https://bloqus.firebaseio.com/games");
  var firebase = $firebaseObject(ref);
  firebase.$bindTo($scope, "games");

  firebase.$loaded().then( function () {
    $scope.createGame = function () {
      var randomId = Math.round(Math.random() * 100000000);
      var gameId = Math.round(Math.random() * 100000);
      $scope.games[randomId] = {
        id: gameId,
        status: 'active'
      };
    }
  });

    $scope.enterGame = function (playername){
        console.log(playername, 'entering game: ', $scope.currentGameId);

    };

    $scope.joinGame = function (gamenum) {
      angular.forEach($scope.games, function (value, key){
        console.log('key', key);
        console.log('value', value)
        if (value.id == gamenum){
          $scope.gameExists = true;
          $scope.currentGameId = value.id;
          console.log('found it! id: ', value.id);
        }
      })
    }

});

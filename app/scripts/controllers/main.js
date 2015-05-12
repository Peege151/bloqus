'use strict';

angular.module('bloqusApp')

.controller("MainCtrl", function($scope, $state, $firebaseObject) {
  var ref = new Firebase("https://bloqus.firebaseio.com/"),
      firebase = $firebaseObject(ref);

  firebase.$bindTo($scope, "firebase");

  firebase.$loaded().then( function () {

    $scope.createGame = function () {
      var randomId = Math.round(Math.random() * 100000000);
      var gameId = Math.round(Math.random() * 100000);
      if (!$scope.firebase.games) $scope.firebase.games = {};
      $scope.firebase.games[randomId] = {
        id: gameId,
        status: 'active',
        host: $scope.hostname,
        players: {
          player1: $scope.hostname,
          player2: 'Computer',
          player3: 'Computer',
          player4: 'Computer'
        }
      };

      var hostID = Math.round(Math.random() * 10000000);
      if (!$scope.firebase.players) $scope.firebase.players = {};
      $scope.firebase.players[hostID] = {
        game: gameId,
        name: $scope.hostname
      };

      //$('#create-game-modal').modal('hide');
      $('.modal-backdrop').remove();
      $state.go('lobby');

    };

    $scope.enterGame = function (playername) {

      //generate a random id
      var randomId = Math.round(Math.random() * 100000000);

      //check if a players schema exists, if not create one
      if (!$scope.firebase.players) $scope.firebase.players = {};

      var keepGoing = true;
      angular.forEach($scope.firebase.games[$scope.currentGameId].players, function(name, player){
        if (keepGoing){
          if(name == 'Computer'){
            $scope.firebase.games[$scope.currentGameId].players[player] = playername;
            keepGoing = false;

            //add the player to the database with the game id
            $scope.firebase.players[randomId] = {
              game: $scope.sharableId,
              name: playername
            };

            $('.modal-backdrop').remove();
            $state.go('lobby')
          }
        }
        $scope.gameIsFull = true;
        $('#join-game-modal').modal('hide');
      });

    };

    $scope.joinGame = function (gamenum) {
      var foundGame = false;
      angular.forEach($scope.firebase.games, function (value, key){
        if (value.id == gamenum){
          $scope.gameExists = true;
          $scope.sharableId = value.id;
          $scope.currentGameId = key;
          foundGame = true;
        }
      });
      if (!foundGame){
        $scope.gameDoesNotExist = true;
        $('#join-game-modal').modal('hide');
      }
    }

  });

});

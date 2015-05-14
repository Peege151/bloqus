'use strict';

angular.module('bloqusApp')
    .controller('LobbyCtrl', function ($scope, $state, $stateParams, $firebaseObject, localStorageService) {
        var ref = new Firebase("https://bloqus.firebaseio.com/"),
            fbMessages = new Firebase("https://bloqus.firebaseio.com/messages"),
            firebase = $firebaseObject(ref),
            player = localStorageService.get('player'),
            currentId, currentGame;

        firebase.$bindTo($scope, "firebase");

        firebase.$loaded().then(function () {
            currentId = $stateParams.currentId;
            currentGame = $scope.firebase.games[currentId];
            var fbGameStatusRef = new Firebase("https://bloqus.firebaseio.com/games/" + currentId + "/status");
            var fbGameStatus = $firebaseObject(fbGameStatusRef);
            $scope.shareId = $stateParams.shareId;
            $scope.currentPlayers = currentGame.player;

            fbGameStatus.$watch(function () {
                if (fbGameStatus.$value === 'start'){
                    $state.go('gameboard', {game: currentGame});
                }
            });

            $scope.startGame = function () {
                $scope.firebase.games[currentId].status = 'start';
                $state.go('gameboard', {game: currentGame})
            };

        });


        // REGISTER DOM ELEMENTS
        var messageField = $('#messageInput');
        var messageList = $('#example-messages');

        // LISTEN FOR KEYPRESS EVENT
        messageField.keypress(function (e) {
            if (e.keyCode == 13) {
                //FIELD VALUES
                var username = player;
                var message = messageField.val();

                //SAVE DATA TO FIREBASE AND EMPTY FIELD
                fbMessages.push({name: username, text: message});
                messageField.val('');
            }
        });

        // Add a callback that is triggered for each chat message.
        fbMessages.limitToLast(10).on('child_added', function (snapshot) {
            //GET DATA
            var data = snapshot.val();
            var username = data.name || "anonymous";
            var message = data.text;

            //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
            var messageElement = $("<li>");
            var nameElement = $("<strong></strong>");
            nameElement.text(username);
            messageElement.text(message).prepend(nameElement);

            //ADD MESSAGE
            messageList.append(messageElement);

            //SCROLL TO BOTTOM OF MESSAGE LIST
            messageList[0].scrollTop = messageList[0].scrollHeight;
        });

    });

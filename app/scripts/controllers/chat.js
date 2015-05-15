'use strict'
angular.module('bloqusApp')
.controller("ChatCtrl", function ($scope, $firebaseArray, localStorageService){
	console.log($scope.current)
	var fbMessages = (new Firebase("https://bloqus.firebaseio.com/messages/" + $scope.current));
	console.log(fbMessages)
    // REGISTER DOM ELEMENTS
    var messageField = $('#messageInput');
    var messageList = $('#example-messages');
    // LISTEN FOR KEYPRESS EVENT
    messageField.keypress(function (e) {
        if (e.keyCode == 13) {
            //FIELD VALUES
            var username = localStorageService.get("name");
            var message = ": " + messageField.val();

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
})            
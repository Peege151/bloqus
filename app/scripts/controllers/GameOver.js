'use strict';

angular.module('bloqusApp')

    .controller("GameOverCtrl", function ($scope, $state, SignInFactory, $firebaseObject, $stateParams) {
            var currentId = $stateParams.game.$id;
            //var fbCurrentGame = $firebaseObject(new Firebase("https://bloqus.firebaseio.com/games/" + currentId))

           //var boardObj = $stateParams.game.board;


                var redScore = 0;
                var blueScore = 0;
                var greenScore = 0; 
                var yellowScore = 0;
                var blankScore = 0;

            // fbCurrentGame.$loaded().then(function(){
            //     console.log(boardObj);
            //     for(var row in boardObj){
            //         for(var i = 0; i < boardObj[row].length; i++){
            //             if(boardObj[row][i] == 'R') redScore++;
            //             if(boardObj[row][i] == 'B') blueScore++;
            //             if(boardObj[row][i] == 'G') greenScore++;
            //             if(boardObj[row][i] == 'Y') yellowScore++;
            //             if(boardObj[row][i] == 'N') blankScore++;
            //         }
            //     }


            //     console.log("scoreObj 1 :", $scope.scoreObj)
            //     $scope.scoreObj = {
            //     red: redScore,
            //     blue: blueScore,
            //     green: greenScore,
            //     yellow: yellowScore,
            //     blank: blankScore
            //     }

            // })






                console.log("scoreObj 2 : ",$scope.scoreObj)
    });

    /*

    row0: "NNNNNNNNNNNNNNNNNNNN"
    row1: "NNNNNNNNNNNNNNNNNNNN"
    row2: "NNNNNNNNNNNNNNNNNNNN"
    row3: "NNNNNNNNNNNNNNNNNNNN"
    row4: "NNNNNNNNNNNNNNNNNNNN"
    row5: "NNNNNNNNNNNNNNNNNNNN"
    ..row 19 ""
    */

'use strict';

angular.module('bloqusApp')

    .controller("UserCtrl", function ($scope, UserFactory, localStorageService, ngDialog) {

        $scope.user = {
            email: null,
            password: null
        };

        $scope.newUser = {
            first: null,
            last: null,
            email: null,
            password: null
        };

        $scope.userLogin = function (user) {
            UserFactory.userLogin(user).then( function(user){
                localStorageService.set('userName', user.first);
                $scope.$emit('loginEvent', user);
                ngDialog.closeAll();
                console.log('User has logged in.', user);
            })
        };

        $scope.createNewUser = function (newUser) {
            UserFactory.createUser(newUser).then( function(user){
                if (user.status === 401) console.log('Sorry, that email address is already taken.')
                else {
                    $scope.$emit('loginEvent', user);
                    ngDialog.closeAll();
                    console.log('User created.', user);
                }
            })
        };

        UserFactory.checkIfUserIsLoggedIn().then( function(data){
            console.log('Is user logged in?', data)
        })


    });
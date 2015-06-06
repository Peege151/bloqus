'use strict';

angular.module('bloqusApp')

    .factory('UserFactory', function ($http, localStorageService) {

        return {

            userLogin: function (user) {
                return $http.post('api/login', user).then( function(user){
                    console.log('logged in through the UserFactory', user)
                    localStorageService.set('first', user.data.first);
                    localStorageService.set('last', user.data.last);
                    localStorageService.set('email', user.data.email);
                    return user.data;
                })
            },

            logout: function () {
                return $http.delete('api/login').then( function (data){
                    console.log('DELETED.', data)
                })
            },

            createUser: function (newUser) {
                return $http.post('/api/user', newUser).then( function(user){
                    console.log('created user through the UserFactory', user);
                    localStorageService.set('first', user.data.first);
                    localStorageService.set('last', user.data.last);
                    localStorageService.set('email', user.data.email);
                    return user.data;
                }).catch( function (error) {
                    console.log('create user error!', error)
                    return error;
                })
            },

            checkIfUserIsLoggedIn: function () {
                return $http.get('/api/user').then( function(response){
                    console.log('factory response!', response)
                    return response.data;
                })
            }

        }

    });
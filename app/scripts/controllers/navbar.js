'use strict';
angular.module('bloqusApp')
    .controller("NavCtrl", function ($scope, $rootScope, $state, ngDialog, UserFactory) {
        $scope.$watch(function () {
            if ($state.current.name == 'main') {
                $scope.hideNav = true;
            } else {
                $scope.hideNav = false;
            }
        });

        $rootScope.$on('loginEvent', function (user){
            console.log('login watcher!')
            UserFactory.checkIfUserIsLoggedIn().then(function (data) {
                $scope.userIsLoggedIn =  data.user;
                if (data.user) $scope.userFirstName = data.user.first;
                console.log('checkIfUserIsLoggedIn data', data)
            });
        });

        $scope.showRules = function () {
            ngDialog.open({
                template: 'views/modals/rules-modal.html',
                controller: 'NavCtrl'
            })
        };

        $scope.userModal = function () {
            ngDialog.open({
                template: 'views/modals/user-modal.html',
                controller: 'UserCtrl'
            })
        };

        $scope.openSettings = function () {
            $state.go('settings');
        };

        $scope.logout = function () {
            UserFactory.logout().then(function (data) {
                $scope.$emit('loginEvent');
                console.log('User has logged out.', data)
            })
        };
    });
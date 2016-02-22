var officeApp = angular.module("officeApp", ['ngRoute', 'officeAppControllers']);
var officeAppControllers = angular.module('officeAppControllers', []);

officeApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/repos/:user', {
            templateUrl: 'views/repo-list.html',
            controller: 'repoListCtrl'
        }).when('/repos/:user/:repoName', {
            templateUrl: 'views/repo-details.html',
            controller: 'repoDetailCtrl'
        }).when('/', {
            templateUrl: 'views/landing-page.html',
            controller: 'landingPage'
        }).otherwise({
            redirectTo: '/'
        });
    }]);


officeAppControllers.controller('landingPage', ['$scope',
    function ($scope) {

    }]);


officeAppControllers.controller('repoListCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        var url = "https://api.github.com/users/" + $routeParams.user + "/repos";
        $http.get(url).success(function (data) {
            $scope.repos = data;
        });
        $scope.orderProp = 'updated_at';
    }]);


officeAppControllers.controller('repoDetailCtrl', ['$scope', '$routeParams','$http',
    function ($scope, $routeParams,$http) {
        var url = "https://api.github.com/repos/"+$routeParams.user+"/"+$routeParams.repoName+"/commits";
        $scope.repoName = $routeParams.repoName;

        $http.get(url).success(function (data) {
            $scope.commits = data;
        });

    }]);
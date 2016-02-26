var officeApp = angular.module("officeApp", ['ngRoute', 'officeAppControllers']);
var officeAppControllers = angular.module('officeAppControllers', []);

const client = window.location.search.split('=')[2].split('|')[0];
const os = window.location.search.split('=')[2].split('|')[1];
const version = window.location.search.split('=')[2].split('|')[2];
const locale = window.location.search.split('=')[2].split('|')[3];

Office.initialize = () => {
    $('body').addClass(client.toLowerCase());
};

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
var app=angular.module("app",['ngRoute', 'ngCookies' ]);
app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/altaPagos', {
		templateUrl : "pages/altaPagos.html",
		controller : "pagosAddController"
	});
}]);

app.controller('navigation', [ 'sessionService', '$rootScope', '$scope',
	'$http', '$location',

	function(sessionService, $rootScope, $scope, $http, $location) {

		$scope.credentials = {};
		$scope.login = function() {
			sessionService.authenticate($scope.credentials, function() {
				if ($rootScope.authenticated) {
					$scope.error = false;
					$location.path("/");
				} else {
					$location.path("/login");
					$scope.error = true;
				}
			});
		};
	} ]);
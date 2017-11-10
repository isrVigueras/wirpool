var app=angular.module("app",['ngRoute', 'ngCookies' ]);
app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/altaPagos', {
		templateUrl : "pages/altaPagos.html",
		controller : "pagosAddController"
	});
	$routeProvider.when('/listaOTs', {
		templateUrl : "pages/listOTs.html",
		controller : "OTsListController"
	});
	$routeProvider.when('/login', {
		templateUrl : "pages/login.html",
		controller : "navigation"
	});
	
	$routeProvider.otherwise({
		redirectTo : '/listOTs'
	});
}]);

app.service('sessionService', [
	'$rootScope',
	'$http',
	'$location',
	'$q',
	function($rootScope, $http, $location, $q) {
		this.authenticate = function(credentials, callback) {

			var headers = credentials ? {
				authorization : "Basic"
						+ btoa(credentials.username + ":"
								+ credentials.password)
			} : {};
			$http.get('user', {
				headers : headers
			}).success(function(data) {
				if (data.usuario) {
					$rootScope.authenticated = true;
					$rootScope.variable = true;
					$location.path("/listaOTs");
				} else {
					$rootScope.authenticated = false;
				}
			}).error(function(data) {
				alert("Usuario o Contraseña incorrectos");
				$location.path("/login");
			});
		}
		
		this.isAuthenticated = function() {
			var d = $q.defer();
			$http.get("currentSession").success(function(data) {
				$rootScope.authenticated = true;
				d.resolve(data);
			}).error(function(data) {
				$location.path("/login");
			});
			return d.promise;
		}
	} ]);

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
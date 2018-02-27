app.directive('submenu',function(){
	return{
		restrict: "AE",
		scope: {perfil: '=perfil'},
		templateUrl:'pages/menuTemplate.html'
	};
});

app.controller('headerController',['$scope','$rootScope','$location','$http','$cookieStore',function($scope,$rootScope,$location,$http,$cookieStore){
	$scope.CerrarSesion = function(){
		$http.get("/usuario/cerrarSesion").then(function(response) {
			$rootScope.variable = false;
			$location.path("/login");
		}, function(response) {
			$location.path("/login");
		});
	};
	
	$http.get("/usuario/check").then(function(response){
		$rootScope.variable = true;
	},function(response){
		if(response.status==403){
			$rootScope.variable = false;
			$scope.empresas={};
		}
		$location.path("/login");
	});
}]);
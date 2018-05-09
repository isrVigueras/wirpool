app.service('movimientosService', ['$q' ,'$http', function($q, $http){
	this.loadResguardos = function(id) {
		var d = $q.defer();
		$http.get("/movimientos/getResguardos/"+id).then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.loadCA  = function(id) {
		var d = $q.defer();
		$http.get("/ots/loadCA/"+id).then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.getPaginas = function(page) {
		var d = $q.defer();
	
		$http.get("/movimientos/getPages/").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.load = function(page) {
		var d = $q.defer();
		$http.get("/movimientos/loadPage/"+page).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	};
}])

app.controller("movimientosController",['$rootScope', '$scope','$cookieStore', '$window', '$location', 'CBService','cuentaservice','OPMS','userFactory','movimientosService',function($rootScope, $scope, $cookieStore, $window, $location, CBService,cuentaservice,OPMS,userFactory,movimientosService){
	

	
}]);
